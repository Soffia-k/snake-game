import React, { useRef, useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { scoreService } from '../service/scoreService'

export const PlayPage = () => {
    const canvasRef = useRef(null)
    const [score, setScore] = useState(0)
    const [gameOver, setGameOver] = useState(false)
    const { userId } = useContext(AuthContext)
    
    useEffect(() => {
        if (gameOver) return
        
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        const width = canvas.width
        const height = canvas.height
        
        const blockSize = 10
        const widthBlocks = width / blockSize
        const heightBlocks = height / blockSize
        let gameScore = 0
        
        const drawBorder = () => {
            ctx.fillStyle = 'gray'
            ctx.fillRect(0, 0, width, blockSize)
            ctx.fillRect(0, height - blockSize, width, blockSize)
            ctx.fillRect(0, 0, blockSize, height)
            ctx.fillRect(width - blockSize, 0, blockSize, height)
        }
        
        const drawScore = () => {
            ctx.font = "18px Arial"
            ctx.fillStyle = "Black"
            ctx.textAlign = "left"
            ctx.textBaseline = "top"
            ctx.fillText("Score: " + gameScore, blockSize, blockSize)
            setScore(gameScore)
        }
        
        const endGame = async () => {
            clearInterval(intervalId)
            
            const userData = JSON.parse(localStorage.getItem('userData') || '{}')
            const token = userData.token
            const currentUserId = userData.userId
            
            if (currentUserId && gameScore > 0 && token) {
                try {
                    await scoreService.saveScore(gameScore)
                    console.log('Score saved:', gameScore)
                } catch (error) {
                    console.error('Failed to save score:', error)
                }
            }
            
            ctx.font = "40px Arial"
            ctx.fillStyle = "Black"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText("Game end! Score: " + gameScore, width / 2, height / 2)
            
            setGameOver(true)
        }
        
        class Block {
            constructor(col, row) {
                this.col = col
                this.row = row
            }
            
            drawSquare(color) {
                const x = this.col * blockSize
                const y = this.row * blockSize
                ctx.fillStyle = color
                ctx.fillRect(x, y, blockSize, blockSize)
            }
            
            drawCircle(color) {
                const centerX = this.col * blockSize + blockSize / 2
                const centerY = this.row * blockSize + blockSize / 2
                const radius = blockSize / 2 - 1
                ctx.fillStyle = color
                ctx.beginPath()
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false)
                ctx.fill()
            }
            
            equal(other) {
                return this.col === other.col && this.row === other.row
            }
        }
        
        class Snake {
            constructor() {
                this.segments = [
                    new Block(7, 5),
                    new Block(6, 5),
                    new Block(5, 5)
                ]
                this.direction = "right"
                this.nextDirection = "right"
            }
            
            draw() {
                for (let i = 0; i < this.segments.length; i++) {
                    this.segments[i].drawSquare("Blue")
                }
            }
            
            move() {
                const head = this.segments[0]
                let newHead
                
                this.direction = this.nextDirection
                
                if (this.direction === "right") {
                    newHead = new Block(head.col + 1, head.row)
                } else if (this.direction === "down") {
                    newHead = new Block(head.col, head.row + 1)
                } else if (this.direction === "left") {
                    newHead = new Block(head.col - 1, head.row)
                } else if (this.direction === "up") {
                    newHead = new Block(head.col, head.row - 1)
                }
                
                if (this.checkCollision(newHead)) {
                    endGame()
                    return
                }
                
                this.segments.unshift(newHead)
                
                if (newHead.equal(apple.position)) {
                    gameScore++
                    apple.move()
                } else {
                    this.segments.pop()
                }
            }
            
            checkCollision(head) {
                const left = (head.col === 0)
                const top = (head.row === 0)
                const right = (head.col === widthBlocks - 1)
                const bottom = (head.row === heightBlocks - 1)
                
                const wall = left || top || right || bottom
                let self = false
                
                for (let i = 0; i < this.segments.length; i++) {
                    if (head.equal(this.segments[i])) {
                        self = true
                    }
                }
                
                return wall || self
            }
            
            setDirection(newDirection) {
                if (this.direction === "up" && newDirection === "down") {
                    return
                } else if (this.direction === "right" && newDirection === "left") {
                    return
                } else if (this.direction === "down" && newDirection === "up") {
                    return
                } else if (this.direction === "left" && newDirection === "right") {
                    return
                }
                
                this.nextDirection = newDirection
            }
        }
        
        class Apple {
            constructor() {
                this.position = new Block(10, 10)
            }
            
            draw() {
                this.position.drawCircle("LimeGreen")
            }
            
            move() {
                const randomCol = Math.floor(Math.random() * (widthBlocks - 2)) + 1
                const randomRow = Math.floor(Math.random() * (heightBlocks - 2)) + 1
                this.position = new Block(randomCol, randomRow)
            }
        }
        
        const snake = new Snake()
        const apple = new Apple()
        
        const handleKeyDown = (event) => {
            const directions = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down'
            }
            
            const newDirection = directions[event.keyCode]
            if (newDirection !== undefined) {
                snake.setDirection(newDirection)
            }
        }
        
        let intervalId = setInterval(() => {
            ctx.clearRect(0, 0, width, height)
            drawBorder()
            drawScore()
            snake.move()
            snake.draw()
            apple.draw()
        }, 100)
        
        document.addEventListener('keydown', handleKeyDown)
        
        return () => {
            clearInterval(intervalId)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [gameOver, userId])
    
    const restartGame = () => {
        setGameOver(false)
        setScore(0)
    }
    
    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Snake Game</h1>
            
            {gameOver && (
                <div>
                    <h2>Game Over!</h2>
                    <button onClick={restartGame} style={{ padding: '10px 20px', marginBottom: '20px' }}>
                        Play Again
                    </button>
                </div>
            )}
            
            <canvas 
                ref={canvasRef} 
                width="400" 
                height="400"
                style={{ 
                    border: '1px solid #ccc', 
                    display: 'block', 
                    margin: '0 auto',
                    backgroundColor: '#f0f0f0'
                }}
            />
        </div>
    )
}