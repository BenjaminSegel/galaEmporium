import { utcToDate, isValidDate } from "../functions/utcToDate.js"
import { isClubOwner } from "../functions/general.js"

export default async function showEvents(clubId){
    let events

    if (!clubId) {
        const response = await fetch ("/api/event")
        events = await response.json()
    } else {
        events = await (await fetch(`/api/clubEvents/${clubId}`)).json()
    }

    let html = ""
    events.sort((a,b) => {
        return new Date(a.date) - new Date(b.date)
    })

    for(let event of events){
        
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
                </ul>
            </u>
        </div>`
    }
    return `
    <article>${html}</article>`

}


