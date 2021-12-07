import React, { useState, useEffect, Component } from 'react';
import Kysymykset1 from './Kysymykset1';



import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { red } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { white } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Tentti1 from './Tentti1';


import axios from 'axios'

const TenttiSovellus=(props)=> {

    const [dataNoudettu, setDataNoudettu] = useState(false)
    const [tentit, setTentit]  = useState()
    const [valittuTentti, setValittuTentti] = useState()
    const [lisääTentti, setLisääTentti] = useState(false)
    const [päivitäTentti, setPäivitäTentti] = useState(false)
    const [poistaTentti, setPoistaTentti] = useState(false)

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
 

    const Dispatch = (o) => {
        let tenttiKopio = (JSON.parse(JSON.stringify(tentit)))
    
    
        switch (o.type) {
            case "LISÄÄ_TENTTI":
                setLisääTentti(true)
                break;
            case "POISTA_TENTTI":
                setPoistaTentti(true)
                break;
                
                
            case "POISTA_VASTAUS":
                tenttiKopio[valittuTentti].kysymykset[o.data.kysymysIndex].vastaukset.splice(o.data.vastausIndex, 1)
                setPäivitäTentti(true)
                break;
            case "LISÄÄ_VASTAUS":
                tenttiKopio[valittuTentti].kysymykset[o.data.kysymysIndex].vastaukset.push({teksti:o.data.txt, valittu:false})
                setPäivitäTentti(true)
                break;
            case "LISÄÄ_KYSYMYS":
                tenttiKopio[valittuTentti].kysymykset.push({teksti: "Mitä vielä kysyä?", vastaukset:[]})
                setPäivitäTentti(true)
                break;
            case "VALINTA":
                tenttiKopio[valittuTentti].kysymykset[o.data.kysymysIndex].vastaukset[o.data.vastausIndex].valittu = !tenttiKopio[valittuTentti].kysymykset[o.data.kysymysIndex].vastaukset[o.data.vastausIndex].valittu
                setPäivitäTentti(true)
                break;
            default: throw "Nyt on jokin vialla"  

      
        }
    
        setTentit(tenttiKopio)
        
    }

    const päivittääTentin = () => {
        axios.put('http://localhost:3004/koulut/' + tentit[valittuTentti].id, tentit[valittuTentti])
            .then(function (response) {
                // handle success
                console.log("tentin tiedot päivitetty ok");

            })
            .catch(function (error) {
                // handle error
                console.log(error);

            })
            .then(function () {
                setPäivitäTentti(false)

                // always executed
            });

    }

    const poistaaTentin = async () => {
        console.log("poistetaan tentin")
        console.log(tentit[valittuTentti])
        try {
            let response = await axios.delete('http://localhost:3004/tentit/' + tentit[valittuTentti].id)
            console.log("tentti poistettu");
            let tenttiKopio = JSON.parse(JSON.stringify(tentit))
            tenttiKopio.splice(valittuTentti, 1)

            //awaitin jälkeen jokainen näistä johtaa renderöitiin - ei batchia!
            setValittuTentti(undefined) 
            setTentit(tenttiKopio)
          
        } catch (e) {

        } finally {
            setPoistaTentti(false)
         
        }

    }


    const lisätäTentin = () => {

        let tenttiKopio = JSON.parse(JSON.stringify(tentit))
        
        let uusiTentti = {"id":tenttiKopio.length,"otsikko":"Tentti " + (tenttiKopio.length + 1), "kysymykset":[{
            "teksti": "Mitä vielä kysyä?", "vastaukset":[] }] }
        console.log(uusiTentti)
        axios.post('http://localhost:3004/tentit', {"id":tenttiKopio.length,"otsikko":"Tentti " + (tenttiKopio.length + 1), "kysymykset":[{
            "teksti": " ", "vastaukset":[] }] })
            .then(function(response) {
                console.log("tentti lisätty ok");
                tenttiKopio.push(uusiTentti)
                setValittuTentti(undefined)
                setTentit(tenttiKopio);
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                setLisääTentti(false)

                // always executed
            });
    }
  
    useEffect(() => {
        if (!dataNoudettu) {
            axios.get('http://localhost:3004/tentit')
            .then(function (response) {
                console.log("noudettu data", response.data);

                setTentit(response.data)
                setDataNoudettu(true)

            })
            .catch(function (error) {
            console.log(error);
            })
            .then(function () {
            });
        }
        if (lisääTentti) {
            lisätäTentin()
        } else if (poistaTentti) {
            poistaaTentin()
        } else if (päivitäTentti) {
                päivittääTentin()
        }
      
    }, [dataNoudettu, päivitäTentti, poistaTentti, lisääTentti]);
  /*
    var state = { 
        login: '', 
        password: ''
    } 
    
    */
    var user = async () => {
        if ((username != null) && (password != null)) {
            
            const query = await axios.post('http://localhost:443/login', {lo:username, pa:password})
            console.log(query.data)
        }
        
     }
      
    

    /*
        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          api.login(emailField.value, passwordField.value);
        };
        */
    return (
    
        <div>
            <br></br>
            <div style={{marginLeft: '15px'}}><input type="text" id="uusi"  value={username} onChange={(event)=>setUsername(event.target.value)}/>
                
                <Button style={{maxWidth: '170px', maxHeight: '25px', minWidth: '100px', minHeight: '25px', marginLeft: "7px"}} variant="contained" color="success" onClick={(event)=>user( {data:{username:username}})} >Login  </Button>
             
            </div>

            <br></br>

            <br></br>
            <div style={{marginLeft: '15px'}}><input type="text" id="uusi"  value={password} onChange={(event)=>setPassword(event.target.value)}/>
                
                <Button style={{maxWidth: '170px', maxHeight: '25px', minWidth: '100px', minHeight: '25px', marginLeft: "7px"}} variant="contained" color="success" onClick={(event)=>user( {data:{password:password}})} >Password</Button>
             
            </div>

            <Box dense sx={{ width: '100%', padding: 5,
                maxWidth: 560, maxHeight: '150px', minHeight: '45px', borderRadius: "25px", bgcolor: "#12a086", marginLeft:"25px", marginTop:"15px", justifyContent: "center" }}>
                <div>{(dataNoudettu==true) && <div>{tentit.map((item, index) => <Button key={item.id} style={{borderRadius: "5px", maxWidth: '170px', maxHeight: '25px', minWidth: '100px', minHeight: '25px', 
                    backgroundColor: "white", color: "#12a086", fontWeight: "bold", marginLeft: "15px", marginTop: "15px"}} 
                    variant="contained"  onClick={() => {setValittuTentti(index)}}> 
                    {item.otsikko}</Button> )}
            
                
                <Button data-testid="butlt" style={{borderRadius: "5px", fontWeight: "bold", maxWidth: '170px', maxHeight: '25px', minWidth: '100px', minHeight: '25px', marginLeft: "15px", marginTop: "15px"}} variant="contained" color="warning" onClick={() => Dispatch({type: "LISÄÄ_TENTTI"})}>Lisää tentti</Button>
            <br></br>
            
            </div>}</div>
            {(valittuTentti!==undefined) && <Tentti1 tentti={tentit[valittuTentti]} Dispatch={Dispatch} tenttiIndex={valittuTentti}/>}
            
            </Box>
            
            
        
        </div>

      

    );


   



}




export default TenttiSovellus;

//json-server --watch db.json --port 3004