import { useState } from 'react';

const NewListModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name);
    setName('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4 text-sky-700">Crear nueva lista</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre de la lista"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewListModal;
