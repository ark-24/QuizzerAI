import React from "react";


const Summary = (content:any) => {
    console.log(content?.content);
    
    return(
    <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-3/4 mx-auto overflow-auto whitespace-break-spaces " >
        {content?.content?.Base}
        </div>
    )
}

export default Summary;