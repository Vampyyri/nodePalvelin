import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


const Vastaukset1 = (p) => {
    

    
    return (<div>
        
        
        

        <br></br><div class="vastaukset">{p.vastaus.teksti}

        

        

        <input type="checkbox" onClick={
                ()=>p.Dispatch({type:"VALINTA",data: {vastausIndex:p.vastausIndex, kysymysIndex:p.kysymysIndex}})}
                checked={p.vastaus.valittu}></input>
        </div>
        <Button style={{maxWidth: '170px', maxHeight: '21px', minWidth: '100px', minHeight: '21px', marginLeft: "15px", color:"black" }} variant="outlined" color="success" onClick={()=>p.Dispatch({type:"POISTA_VASTAUS",data: {vastausIndex:p.vastausIndex, kysymysIndex:p.kysymysIndex}})}>Poista vastaus</Button>

    </div>)
}

export default Vastaukset1;