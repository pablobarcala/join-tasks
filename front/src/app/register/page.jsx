"use client"

import { useForm } from 'react-hook-form';
import { useAuth } from '../../store/auth';
import api from '../../services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const { register, handleSubmit } = useForm();
  const setToken = useAuth((s) => s.setToken);
  const router = useRouter()

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/api/register', data);
      setToken(res.data.token);
      router.push('/dashboard');
    } catch (err) {
      alert('Error al registrarse');
    }
  };

  return (
    <div className='flex items-center justify-center flex-col gap-10 mt-20'>
      <p className='font-bold text-4xl text-sky-800'>Join Tasks</p>
      <form
          className='bg-sky-200 shadow-lg p-4 flex flex-col items-center gap-4 w-[50%] rounded-md' 
          onSubmit={handleSubmit(onSubmit)}
      >
        <p className='font-bold text-xl'>Registro</p>
        <input 
          className='
            w-full
            border-2 
            border-sky-400 
            px-4 
            py-2 
            rounded-md 
            focus-within:outline-none
          '
          {...register('name')} 
          placeholder="Nombre completo" 
          required 
        />
        <input 
          className='
            w-full
            border-2 
            border-sky-400 
            px-4 
            py-2 
            rounded-md 
            focus-within:outline-none
          '
          {...register('email')} 
          placeholder="Email" 
          type='email'
          required 
        />
        <input 
          className='
            w-full
            border-2 
            border-sky-400 
            px-4 
            py-2 
            rounded-md 
            focus-within:outline-none
          '
          {...register('password')} 
          type="password" 
          placeholder="Contraseña" 
          required 
        />
        <button 
          className='rounded-md font-bold text-slate-50 bg-sky-950 shadow-md mt-5 px-4 py-2 cursor-pointer'
          type="submit"
        >
          Registrarme
        </button>
        <Link href={"login"} className='underline text-sm'>Ya estoy registrado</Link>
      </form>
    </div>
  );
}