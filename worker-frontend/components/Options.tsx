/* eslint-disable @next/next/no-img-element */
type props = {
    imageUrl:string,
    onSelect:()=>void;
}


const Options = ({imageUrl,onSelect}:props) => {
  return (
    <div>
        <img src={imageUrl} onClick={onSelect} className="p-2 w-96 h-60 rounded-md cursor-pointer" alt="img"/>
    </div>
  )
}

export default Options