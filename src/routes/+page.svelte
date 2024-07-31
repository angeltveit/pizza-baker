<script>
  import { browser } from '$app/environment';
  import { draggable, dropzone, dragzone } from '../lib/dnd.js'
  import Alert from '$lib/components/alert/alert.svelte';

  let dragContent = ''
  let noCheeseAlert = false
  let showSuccess = false
  let showGeneralError = false
  let missingNames = false
  let pizzaComment = ''

  let splatSound 
  let mamaMia

  let pizzaName = ''
  let authorName = ''

  if(browser) {
    splatSound = new Audio('/splat.mp3')
    mamaMia = new Audio('/mamamia.mp3')
  }


  
  const ingredients = [{
    name: 'Pepperoni',
    previewPicture: '/ingredients/peperoni.webp',
    placedPicture: '/ingredients/pepperoni-placed.webp',
    width: '60%',
    top: '18%',
    left: '18%',
    layer: 2,
  },{
    name: 'Vanlig ost',
    previewPicture: '/ingredients/cheese.webp',
    placedPicture: '/ingredients/cheese-placed.webp',
    type: 'cheese',
    width: '70%',
    top: '10%',
    left: '15%',
    layer: 1,
  },{
    name: 'Skinke',
    previewPicture: '/ingredients/ham.webp',
    placedPicture: '/ingredients/ham-placed.webp',
    layer: 2,
  },{
    name: 'Mais',
    previewPicture: '/ingredients/corn.webp',
    placedPicture: '/ingredients/corn-placed.webp',
    layer: 4,

  },{
    name: 'Mozzarella',
    previewPicture: '/ingredients/mozzarella.webp',
    placedPicture: '/ingredients/mozzarella-placed.webp',
    type: 'cheese',
    layer: 3,
  },{
    name: 'Oliven',
    previewPicture: '/ingredients/olives.webp',
    placedPicture: '/ingredients/olives-placed.webp',
    layer: 4,
  },{
    name: 'Grillet paprika',
    previewPicture: '/ingredients/bellpepper.webp',
    placedPicture: '/ingredients/bellpepper-placed.webp',
    layer: 4,
  },{
    name: 'Chili',
    previewPicture: '/ingredients/chili.webp',
    placedPicture: '/ingredients/chili-placed.webp',
    layer: 4,
  },{
    name: 'Tomat',
    previewPicture: '/ingredients/tomato.webp',
    placedPicture: '/ingredients/tomato-placed.webp',
    layer: 3,
  },{
    name: 'Paprika',
    previewPicture: '/ingredients/bellpepper.webp',
    placedPicture: '/ingredients/bellpepper-placed.webp',
    layer: 4,
  },{
    name: 'Champignon',
    previewPicture: '/ingredients/mushroom.webp',
    placedPicture: '/ingredients/mushroom-placed.webp',
    layer: 4,
  }, {
    name: 'Løk',
    previewPicture: '/ingredients/onion.webp',
    placedPicture: '/ingredients/onion-placed.webp',
    layer: 3,
  },{
    name: 'Soltørket tomat',
    previewPicture: '/ingredients/tomato.webp',
    placedPicture: '/ingredients/tomato-placed.webp',
    layer: 3,
  },{
    name: 'Burrata',
    previewPicture: '/ingredients/mozzarella.webp',
    placedPicture: '/ingredients/mozzarella-placed.webp',
    type: 'cheese',
    layer: 3,
  },{
    name: 'Blåmuggost',
    previewPicture: '/ingredients/bluecheese.png',
    placedPicture: '/ingredients/bluecheese-placed.png',
    layer: 3,
  },{
    name: 'Mortadella-skinke',
    previewPicture: '/ingredients/mortadella.webp',
    placedPicture: '/ingredients/mortadella-placed.ong',
    layer: 3,
  },{
    name: 'Trøffel',
    previewPicture: '/ingredients/truffle.webp',
    placedPicture: '/ingredients/truffle-placed.webp',
    layer: 4,
  },{
    name: 'Ricotta',
    previewPicture: '/ingredients/ricotta.webp',
    placedPicture: '/ingredients/mozzarella-placed.webp',
    layer: 3,
  }]

  let recipe = new Set()
  function randomBool(seed=20) {
    const max = 100
    const min = 1
    return Math.floor(Math.random() * (max - min + 1) + min) < 20
  }
  function addIngredient(ingredient) {
    recipe.add(ingredient)
    recipe = recipe

    if(randomBool()) {
      mamaMia.currentTime = 0
      mamaMia.play()
    } else {
      splatSound.currentTime = 0
      splatSound.play()
    }
  }

  function reset() {
    recipe = new Set()
    pizzaName = ''
    authorName = ''
  }

  function checks() {
    let cheeses = 0
    Array.from(recipe).forEach(ingredient => {
      if(ingredient.type === 'cheese') {
        cheeses++;
      }
    })

    if(cheeses === 0) {
      noCheeseAlert = true
      return
    }

    if(!pizzaName || !authorName) {
      missingNames = true
      return
    }

    submit()
  }

  async function submit() {
    cancel()
    const ingredients = Array.from(recipe)
    const body = {
      text: `


----------------------------
| *Ny bestilling!* 🍕🍕🍕
----------------------------
| Navn: _${pizzaName}_
| Bestilt av: _${authorName}_
| Tid: ${new Date().toLocaleString()}
| Kommentar: ${pizzaComment}
|
${ingredients.map((ingredient) => {
  return `| * ${ingredient.name}`
 }).join('\n')}
|
----------------------------

`
    }
    const response = await fetch(`https://slack-pizza-monkey.torbjorn-2b3.workers.dev`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    if(response.ok) {
      reset()
      showSuccess = true
    } else {
      showGeneralError = true
    }
    console.log(await response.json())
  }

  function cancel() {
    noCheeseAlert = false
  }

</script>
<style>
  .pizza {
    width: 400px;
  }
  .ingredients {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    background-color: #009246;
    color: #fff;
    width: 33.33vw;
    padding: 1em;
    gap: 1em;
  }
  .mid-section {
    padding: 1em;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    width: 33.33vw;
  }
  .receipt {
    background-color: #ce2b37;
    color: #fff;
    width: 33.33vw;
    padding: 1em;
  }
  .dragzone {
    min-height: 100vh;
  }
  .placed-ingredient {
    position: absolute;
  }
  
</style>
<div class="dragzone flex m-auto" use:dragzone>
  <div class="ingredients min-w-40 min-h-52">
    {#each ingredients as ingredient}
      <div class="ingredient  w-fit h-fit" use:draggable={{ ingredient }}>
        <img class="h-24" src={ingredient.previewPicture} alt={ingredient.name}/>
        <div class="mt-2 text-center font-bold">{ingredient.name}</div>
      </div>
    {/each}

  </div>
  <div class="mid-section">
    <div class="pizza-area relative w-fit h-fit" use:dropzone={{
      onDropzone(transferData) {
        console.log('drop')
        if(!transferData.ingredient) return
        console.log('adding ingredient')
        addIngredient(transferData.ingredient)
      }
    }}
    >
      {#each recipe as ingredient}
        <img style="pointer-events: none; z-index: {ingredient.layer}; width: {ingredient.width}; top: {ingredient.top}; left: {ingredient.left};" class="placed-ingredient" src={ingredient.placedPicture} alt={ingredient.name} />
      {/each}
  
      <img class="pizza" src="/ingredients/dough.svg" alt="dough" />
    </div>
  </div>
  
  <div class="receipt flex flex-col">
    <button type="button" on:click={()=>reset()}  class="mb-4 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Start på nytt</button>

    <div class="mt-4 mb-4 isolate -space-y-px rounded-md shadow-sm bg-white">
      <div class="relative rounded-md rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
        <label for="name" class="block text-xs font-medium text-gray-900">Ditt navn</label>
        <input bind:value={authorName} type="text" name="name" id="name" class="px-2 block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="">
      </div>
      <div class="relative rounded-md rounded-t-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
        <label for="job-title" class="block text-xs font-medium text-gray-900">Hva vil du kalle pizzaen?</label>
        <input bind:value={pizzaName} type="text"  class="px-2 block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="f.eks Lalleröd spesial">
      </div>
      <div class="relative rounded-md rounded-t-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
        <label for="job-title" class="block text-xs font-medium text-gray-900">Lyst å si noe til kokkene?</label>
        <input bind:value={pizzaComment} type="text"  class="px-2 block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="f.eks vi er så glad i dere">
      </div>
    </div>

    <h1 class="text-xl">Ingredienser:</h1>
    {#each Array.from(recipe).sort((a,b) =>a.layer - b.layer) as ingredient}
      <ul>
        <li>{ingredient.name}</li>
      </ul>
    {/each}
    {#if Array.from(recipe).length > 2}

    <button on:click={()=>checks()} type="button" class="mt-auto rounded-md bg-green-400 px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Send bestilling</button>
    {:else}
    <button type="button" class="mt-auto rounded-md bg-slate-300 px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Du må ha minst 3 ingredienser</button>
    {/if}


  </div>
</div>


<Alert
  type='warning'
  title="Noe gikk hakkande galt!"
  description="Prøv igjen eller ta kontakt med kundeservice hvis det rett og slett ikke funker. "
  cancelButton=""
  okButton="OK"
  open={showGeneralError}
  submit={()=> showGeneralError = false}
></Alert>


<Alert
  type='warning'
  title="Du må skrive inn navn"
  description="Ikke vær lat. Skriv inn navnet ditt og gi pizzaen er gøy navn!"
  cancelButton=""
  okButton="Okeeei då"
  open={missingNames}
  submit={()=> missingNames = false}
></Alert>
<Alert
  type='warning'
  title="Ingen ost!"
  description="Du har ikke tatt ost på pizzaen. Er det noe som feiler deg eller? --Antonina"
  cancelButton="Oops.. jeg glemte"
  okButton="Jeg hater ost!"
  open={noCheeseAlert}
  submit={submit}
  cancel={()=> cancel()}
></Alert>

<Alert
  type='success'
  title="Bestilling levert"
  description="Pizzabestillingen er levert. Nå må du smøre deg med tålmodighet mens kjøkkenet slapper av... eeeh jeg mener.. jobber."
  cancelButton=""
  okButton="Oki!"
  open={showSuccess}
  submit={()=> showSuccess = false}
></Alert>