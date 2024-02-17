import { utcToDate, isValidDate } from "../functions/utcToDate.js"
import { addToCart } from "../components/cart.js"
import { isClubOwner } from "../functions/general.js"
let events = []
export default async function showEvents(clubId){
    
    if (!clubId) {
        const response = await fetch ("/api/event")
        events = await response.json()
    } else {
        events = await (await fetch(`/api/clubEvents/${clubId}`)).json()
    }

    
    // console.log(events)

    // console.log(result)
   
    let html = ""
    events.sort((a,b) => {
        return new Date(a.date) - new Date(b.date)
    })

    for(let [index,event] of events.entries()){
        
        html+= `
        <div id="event-container">
            <h1>${event.name} </h1>
            <img src="${event.img}" id="event-img">
            <h2>${event.club_id.name}</h2>
            <h2>${event.description} </h2>
            <a href ="#editEventPage?${event._id}" class="material-symbols-outlined">
                ${await isClubOwner(event.club_id._id) ? "Edit event" : ""} 
            </a> 
            <u>
                <ul>    
                    <li>Cost: ${event.cost}</li> 
                    <li>Date: ${isValidDate(event.date) ? utcToDate(event.date) : ""}</li> 
                    <button onclick= "findEvent(${index});" id="test">Add to cart</button>
                </ul>
            </u>
        </div>`
    }
    // $('#test').on('click', addToCart)
    // $(document).on('click', '#test', addToCart);
    return `
    <article>${html}</article>`

}

function findEvent(index){

    addToCart(result[index])

}

window.findEvent = findEvent

