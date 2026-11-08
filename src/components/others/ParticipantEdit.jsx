import { Field } from "formik";


function ParticipantEdit(props) {


    
    return ( 
        <div className="w-full  flex items-center justify-between my-2 overflow-clip">

            <div className="w-4/5 font-bold over   line-clamp-1 overflow-hidden ">
                <label htmlFor={props?.participant?.fullName} className="text-xs">{props?.participant?.fullName} </label>
            </div>
          
            <div className="w-1/5  flex items-center justify-center ">

                <Field   type="checkbox" name={props?.participant?.fullName} id={props?.participant?.fullName} className=" accent-[var(--yellow)] "  />
            </div>

        </div>
     );
}

export default ParticipantEdit;