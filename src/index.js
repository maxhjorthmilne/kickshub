import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, getDocs,
  addDoc, deleteDoc, doc, orderBy, query, where, onSnapshot
} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDA-XIw8v_my0w-O_fbSeJLPWl75qW_-rA",
    authDomain: "kickshub-394d7.firebaseapp.com",
    projectId: "kickshub-394d7",
    storageBucket: "kickshub-394d7.appspot.com",
    messagingSenderId: "372106126227",
    appId: "1:372106126227:web:d4e87b3c137d8f6dc43e66"
  };

  
  // init firebase
initializeApp(firebaseConfig)

// init services
const db = getFirestore()

// collection ref
const colRef = collection(db, 'shoes')

//user collection ref
const userColRef = collection(db, "user")

//ref to divs
let login = document.querySelector(".login")
let div = document.querySelector(".div");
const page2 = document.querySelector('.page2')

//sorted collection
const sortedShoes = query(colRef, orderBy("artikkelnummer", "desc"));



//getting docs and pasting into html
getDocs(sortedShoes)
.then((snapshot) => {
   
})
.catch(err => {
    console.log(err.message);
})



//update without refresh

onSnapshot(sortedShoes, (snapshot) => {
    let shoes = [];
    snapshot.docs.forEach((doc) => {
      shoes.push({ ...doc.data(), id: doc.id });
    });
    div.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const productDiv = document.createElement('div'); // create a new div element
      productDiv.classList.add('product');
      productDiv.innerHTML = `Tittel: ${shoes[i].tittel}
        <br>modell: ${shoes[i].modell}
        <br>merke: ${shoes[i].merke}
        <br>pris: ${shoes[i].pris}
        <br>artikkelnummer: ${shoes[i].artikkelnummer}
        <br>dato: ${shoes[i].dato}
        <br><br>`;
      div.appendChild(productDiv); // append the new div element to the container
    }
  });


  //login

login.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault()
        const navn = login.username.value
        const passord = login.password.value
        const q = query(userColRef, where("username", "==", navn))

        onSnapshot(q, (snapshot) => {
            let login = []
            snapshot.docs.forEach((doc) => {
                login.push({ ...doc.data(), id: doc.id })
            })
            const pass = login[0].password
            
            if (pass === passord) {
                console.log("congrats")
                document.querySelector(".addshoes").innerHTML = `<h2>legg til sko:</h2>
                    <input type="text" name="tittel" placeholder="tittel">
                    <input type="text" name="modell" placeholder="modell">
                    <input type="text" name="merke" placeholder="merke">
                    <input type="text" name="pris" placeholder="pris">
                    <input type="text" name="dato" placeholder="dato">
                    <input type="text" name="artikkelnummer" placeholder="artikkelnummer">
            
                    <button class="addbtn">add shoe:D</button>
                <br>
                <br>
                <form class="delete">
                    <input type="text" name="id" placeholder="id">
                    <button>remove shoe</button>
                </form>`

                formWrapper.classList.add('d-none');
                page2.classList.remove('d-none');

            } else {
                console.log("passord er feil")
            }
        })
    }
});


//add shoes
const addShoes = document.querySelector(".addshoes")
addShoes.addEventListener("submit", (e) => {
    e.preventDefault();
    addDoc(colRef, {
        tittel: addShoes.tittel.value,
        modell: addShoes.modell.value,
        merke: addShoes.merke.value,
        pris: addShoes.pris.value,
        dato: addShoes.dato.value,
        artikkelnummer: addShoes.artikkelnummer.value,
    })
    .then(() => {
        addShoes.reset()
    })

})

//remove shoe
const removeShoe = document.querySelector(".delete")
removeShoe.addEventListener("submit", (e) => {
    e.preventDefault()
    const docRef = doc(db, "shoes", removeShoe.id.value)
    deleteDoc(docRef)
        .then(() => {
            removeShoe.reset()
            console.log("Object Deleted")
        })
})
