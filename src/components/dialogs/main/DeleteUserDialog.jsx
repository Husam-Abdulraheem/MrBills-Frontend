import React from 'react'

function DeleteUserDialog({isOpen, participantName, onConfirm, onCancel}) {
    if (!isOpen) return null;

  return (



   
    <div  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] p-5 border-none rounded-lg shadow-md z-[1000] text-center bg-neutral-900">

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-center align-bottom transition-all transform  rounded-lg shadow-xl rtl:text-right bg-neutral-900  sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">

            
            <p className="text-white my-3">Are you sure you want to delete {participantName} ?</p>
            <div className='flex gap-5'>
            <button  onClick={onConfirm} className="rounded-full px-10 py-[6px] place-self-center bg-[var(--yellow)] text-[var(--dark)] font-bold text-sm" > Yes</button>
            <button  onClick={onCancel} className="rounded-full px-8 py-[6px] place-self-center bg-transparent border-[var(--yellow)] border-2 font-bold text-sm" > Cancel</button>
            </div>


        </div>

    </div>
    
  );
}

export default DeleteUserDialog