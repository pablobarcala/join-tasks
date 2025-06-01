const ListBtn = ({ title, totalTasks = 0, completedTasks = 0, onClick, selected = false }) => {
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return(
        <div
            onClick={onClick}
            className={`
                flex 
                flex-col 
                gap-2 
                border 
                border-gray-300 
                rounded-2xl 
                p-4 
                shadow-sm 
                hover:shadow-md 
                hover:bg-sky-50 
                transition-all 
                cursor-pointer 
                ${selected ? "bg-sky-50" : ""}`}
        >
            <h3 className="text-xl font-semibold text-sky-700">{title}</h3>

            <div className="text-sm text-gray-600">
                <p>{totalTasks} tarea{totalTasks !== 1 && 's'}</p>
                <p>✅ {completedTasks} completada{completedTasks !== 1 && 's'}</p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                className="bg-sky-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    )
}

export default ListBtn