import { useState, useEffect } from "react";

const useViewElement = (pageid) => {
    const [child, setChild] = useState(null);
    const [parent, setParent] = useState(null);

   

    useEffect(() => {
        const viewElement = JSON.parse(localStorage.getItem("viewElement"));
        setChild(viewElement.filter(item=>item.ParentId===parseInt(pageid) && item.ApiRout!==""));
        setParent(viewElement.filter(item=>item.Id===parseInt(pageid))[0]);
      
        //console.log("viewElement Object is : ", viewElement.filter(item=>item.ApiRout!=="" && item.ElementType===1));

    }, [pageid])
    
    return [child,parent]
}

export default useViewElement