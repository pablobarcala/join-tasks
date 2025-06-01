"use client"

import { useEffect, useState } from 'react';
import api from '../../services/api';
import withAuth from '../../utils/withAuth';
import ListBtn from '@/components/ListBtn';
import { useAuth } from '@/store/auth';
import { jwtDecode } from 'jwt-decode';
import NewListModal from '@/components/NewListModal';
import { useForm } from 'react-hook-form';

function Dashboard() {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [showModal, setShowModal] = useState(false)

  const { token } = useAuth()
  const [userName, setUserName] = useState("")

  const { register, handleSubmit } = useForm()

  useEffect(() => {
    api.get('/api/lists').then((res) => setLists(res.data));
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUserName(decoded.name)
      } catch (err) {
        console.error("Token inválido", err)
      }
    }
  }, []);

  const loadTasks = async (listId) => {
    setSelectedList(listId);
    const res = await api.get(`/api/lists/${listId}/tasks`);
    setTasks(res.data);
  };

  const createList = async (name) => {
    const res = await api.post('/api/lists', { name })
    setLists([...lists, res.data])
    setShowModal(false)
  }

  const onSubmit = async (data) => {
    try {
      const decoded = jwtDecode(token)
      const newTask = {
        ...data,
        listId: selectedList,
        owner: decoded.sub
      }
      const res = await api.post("/api/tasks", newTask)
      setTasks([...tasks, res.data])
      register("title", "")
    } catch (err) {
      alert("Error al crear tarea")
    }
  }

  return (
    <div className='flex flex-col gap-4 m-10'>
      <p className='font-bold text-2xl text-sky-800'>Hola, {userName} 👋🏻</p>
      <h1 className='border-b-2 border-b-sky-100 py-4'>Mis Listas</h1>
      <button 
        onClick={() => setShowModal(true)}
        className='
          cursor-pointer 
          border-2 
          border-sky-600 
          bg-sky-100
          hover:bg-sky-200
          transition 
          text-sky-600 
          w-fit 
          px-6 
          py-2 
          rounded-2xl
        '
      >+ Nueva lista</button>
      <ul className='flex flex-wrap gap-4'>
        {/* <ListBtn title={"Lista 1"} totalTasks={4} completedTasks={2}></ListBtn> */}
        {lists.map((list) => (
          <li key={list._id} onClick={() => loadTasks(list._id)}>
            <ListBtn 
              title={list.name} 
              totalTasks={list.totalTasks}
              completedTasks={list.completedTasks}
              onClick={() => loadTasks(list._id)} 
              selected={list._id === selectedList}  
            />
          </li>
        ))}
      </ul>

      {showModal && (
        <NewListModal 
          onClose={() => setShowModal(false)}
          onCreate={createList}
        />
      )}

      {selectedList && (
        <div className='flex flex-col gap-2'>
          <h2 className='border-b-2 border-b-sky-100 py-4'>Tareas de la lista</h2>
          <form
            className='flex justify-between'
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              className='px-4 py-2 rounded-2xl border-2 border-sky-100 focus-within:outline-none'
              placeholder='+ Nueva tarea' 
              type="text"
              {...register('title')} 
            />
            <button className='bg-sky-100 rounded-md px-4' type='submit'>Guardar</button>
          </form>
          <ul className='my-5'>
            {tasks.map((task) => (
              <li key={task._id}>
                {task.completed ? '✅' : '❌'} {task.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default withAuth(Dashboard);
