import { useState } from 'react'
import AddPostForm from './features/posts/AddPostForm'
import PostsList from './features/posts/PostsList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="App">
      <AddPostForm />
      <PostsList />
    </main>
  )
}

export default App
