import Vastaukset1 from './Vastaukset1';
import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

import Button from '@mui/material/Button';
//import './Tentti1.css';



const Kysymykset1 = (p) => {
    //console.log(p)
    
    const [uusivastaus, setUusivastaus] = useState("")

    
    
    
    return(
        <div><br></br>
        <List dense sx={{ width: '100%', padding: 5,
             maxWidth: 560, borderRadius: "25px", bgcolor: "white", marginTop: 10 }}>
             <div>{p.kysymys.teksti}</div>{p.kysymys.vastaukset.map((vastaus, index) => <Vastaukset1 kysymys={p.kysymys} vastaus = {vastaus} Dispatch={p.Dispatch} kysymysIndex = {p.kysymysIndex} vastausIndex = {index} tentti={p.tentti} />)}
             
            <br></br>
            <br></br>
            
                
            <div style={{marginLeft: '15px'}}><input type="text" id="uusi"  value={uusivastaus} onChange={(event)=>setUusivastaus(event.target.value)}/>
                
                <Button style={{maxWidth: '170px', maxHeight: '25px', minWidth: '100px', minHeight: '25px', marginLeft: "7px"}} variant="contained" color="success" onClick={(event)=>p.Dispatch( {type:"LISÄÄ_VASTAUS",
                        data: {kysymysIndex:p.kysymysIndex, txt:uusivastaus}})} >Lisää vastaus  </Button>
             
            </div>
            
            
        </List>
        
    </div>)


}

export default Kysymykset1;

