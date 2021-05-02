// this is an example. do not use it as a client sided app.

const axios = require('axios')
const readline = require('readline')

// put the id of the shirt to be found here
const shirtToBeFound = 382537701 

var phrases = [
    // Borrowed from xkcd password generator which borrowed it from wherever
    "ability","able","aboard","about","above","accept","accident","according",
    "account","accurate","acres","across","act","action","active","activity",
    "actual","actually","add","addition","additional","adjective","adult","adventure",
    "advice","affect","afraid","after","afternoon","again","against","age",
    "ago","agree","ahead","aid","air","airplane","alike","alive",
    "all","allow","almost","alone","along","aloud","alphabet","already",
    "also","although","am","among","amount","ancient","angle","angry",
    "animal","announced","another","answer","ants","any","anybody","anyone",
    "anything","anyway","anywhere","apart","apartment","appearance","apple","applied",
    "appropriate","are","area","arm","army","around","arrange","arrangement",
    "arrive","arrow","art","article","as","aside","ask","asleep",
    "at","ate","atmosphere","atom","atomic","attached","attack","attempt",
]

const makePhrase = () => {
    let phrase = []
    for (let index = 0; index < 4; index++) {
        let ran = Math.floor(Math.random() * 96)
        phrase.push(phrases[ran])
    }
    return phrase.join(" ")
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const userId = rl.question("What is your roblox userId? ", async a => {
    const ranWords = makePhrase()
    const user = await axios.get(`https://users.roblox.com/v1/users/${a}`).catch(() => {
        console.log("Bad userId")
        process.exit()
    })
    console.log(`Hello, ${user.data.name} please verify this is your account by putting this in your about: ${ranWords}, reply with "done" when you are ready.`)
    rl.on('line', async (input) => {
        if(input.toLowerCase() != "done") return
        const about = await axios.get(`https://users.roblox.com/v1/users/${a}`)
        if(about.data.description != ranWords) {
            console.log("The text on your profile doesn't match the words given.")
            process.exit()
        }
        axios.get(`https://www.roblox.com/users/inventory/list-json?assetTypeId=11&itemsPerPage=100&pageNumber=1&sortOrder=Desc&userId=${a}`)
        .then((res) => {
            let shirtFound;
            res.data.Data.Items.forEach(element => {
                if(element.Item.AssetId === shirtToBeFound) return shirtFound = true
            });
            if(!shirtFound) return console.log("Shirt not found")
            console.log("Shirt found in your inventory!")

            // user is now verified to have bought your shirt, do whatever you want here
        }) 
    })

})