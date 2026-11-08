function SuccessAlert(props) {
    return ( 
        <div className="slideDownAndUpSuccess top-3 content-center mt-3 min-w-64 bg-black   text-white text-sm p-4 flex z-50 justify-between">

            <div>
                <div className="flex items-center">
        
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className=" size-5 mr-2 text-green-500">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                </svg>
                <p>
                    {props.message}
                </p>
                </div>
            </div>

            <div onClick={() => {props.setSuccessMessage("") ; clearInterval(props.timer)}} >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                />
                </svg>
            </div>

        </div>
     );
}

export default SuccessAlert;