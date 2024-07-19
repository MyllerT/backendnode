import express from 'express'
import { prismaClient } from './database'

const app = express()
app.use(express.json())

const port = process.env.PORT ?? 4000

// Rota para obter todos os livros
app.get('/books', async (request, response) => {
  const books = await prismaClient.book.findMany()
  return response.json(books)
})

// Rota para criar um novo livro
app.post('/books', async (request, response) => {
  const { description, name } = request.body
  const book = await prismaClient.book.create({
    data: {
      description,
      name,
    },
  })
  return response.json(book)
})

// Rota para atualizar um livro existente
app.put('/books/:id', async (request, response) => {
  const { id } = request.params
  const { description, name } = request.body
  try {
    const book = await prismaClient.book.update({
      where: { id: Number(id) },
      data: {
        description,
        name,
      },
    })
    return response.json(book)
  } catch (error) {
    return response.status(404).json({ message: 'Book not found' })
  }
})

// Rota para deletar um livro
app.delete('/books/:id', async (request, response) => {
  const { id } = request.params
  try {
    await prismaClient.book.delete({
      where: { id: Number(id) },
    })
    return response.status(204).send()
  } catch (error) {
    return response.status(404).json({ message: 'Book not found' })
  }
})

app.listen(port, () => console.log('Server is running on port ', port))
