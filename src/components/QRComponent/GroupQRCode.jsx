import {QRCodeSVG} from "qrcode.react";

function GroupQRCode({groupCode}) {
    
  return (
    <div className="border-4 border-white rounded-lg">
      
        <QRCodeSVG value={groupCode} size={95} />

    </div>
  )
}

export default GroupQRCode;