function EmptySection(props) {
    return ( 
        <section className="w-full h-full  text-center items-center content-center ">
            
            <div className="container flex items-center h-full m-auto">
                <div className="flex flex-col items-center mx-auto text-center">

                    <p className="p-3 text-sm font-medium text-[var(--yellow)] rounded-full bg-[var(--lightDark)] ">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    </p>
                    <h1 className="mt-3 text-xl font-semibold text-[var(--gray)] ">{props.title}</h1>
                    <p className="mt-4 text-gray-400 ">{props.message} </p>

                </div>
            </div>

        </section>
     );
}

export default EmptySection;