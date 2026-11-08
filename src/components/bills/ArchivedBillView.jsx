import Participant from "../others/Participant";
import HistoryDialog from "../dialogs/bills/HistoryDialog";


function ArchivedBillView(props) {


    return ( 
        <div className="w-full bg-[var(--darkBlue)] rounded-2xl py-2 px-4 my-3">

            <div className="w-full flex items-center   ">

                {/* Description & Total Price */}
                <div className="w-full  line-clamp-1 flex justify-end">
                    <h3 className="text-lg font-bold max-w-[28%] overflow-hidden">  {props.bill.total } ₺ </h3>
                    <h3 className="text-lg font-bold max-w-[80%] overflow-hidden"> | {" " + props.bill.description } </h3>
                </div>

            </div>


            <hr className="bg-white w-full my-2" />

            {/* Participants */}
            <div className="w-full">   
                
                {props?.bill?.claimants?.map((claimant , index) =>{
                    return  <Participant key={index} state={true} claimant={claimant} archived={true} receipt={claimant?.receipt} />
                })} 
         

            </div>

            <hr className="bg-white w-full my-3" />
            
            <div className="w-full flex justify-between items-center mt-2">
                <p className="text-xs text-gray-400">  {(props.bill.createDate || props.bill.date || "").split("T")[0]} </p>

                <HistoryDialog  log={props.bill.activityLogs}/>
            </div>

        </div>
     );
}

export default ArchivedBillView;