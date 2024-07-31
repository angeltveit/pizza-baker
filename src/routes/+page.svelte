<script>
  import { browser } from '$app/environment';
  import { draggable, dropzone, dragzone } from '../lib/dnd.js'
  let dragContent = ''

  let splatSound 
  let mamaMia 

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
    layer: 3,
  },{
    name: 'Oliven',
    previewPicture: '/ingredients/olives.webp',
    placedPicture: '/ingredients/olives-placed.webp',
    layer: 4,
  },{
    name: 'Paprika',
    previewPicture: '/ingredients/bellpepper.webp',
    placedPicture: '/ingredients/bellpepper-placed.webp',
    layer: 4,
  },{
    name: 'Chili',
    previewPicture: '/ingredients/chili.webp',
    placedPicture: '/ingredients/chili-placed.webp',
    layer: 4,
  },{
    name: 'Ananas',
    previewPicture: '/ingredients/pineapple.webp',
    placedPicture: '/ingredients/pineapple-placed.webp',
    layer: 4,
  },{
    name: 'Tomat',
    previewPicture: '/ingredients/tomato.webp',
    placedPicture: '/ingredients/tomato-placed.webp',
    layer: 3,
  }, {
    name: 'Champignon',
    previewPicture: '/ingredients/mushroom.webp',
    placedPicture: '/ingredients/mushroom-placed.webp',
    layer: 4,
  }, {
    name: 'Løk',
    previewPicture: '/ingredients/onion.webp',
    placedPicture: '/ingredients/onion-placed.webp',
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
    height: 90vh;
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
  
  <div class="receipt">
    <h1 class="text-xl">Ingredienser:</h1>
    {#each Array.from(recipe).sort((a,b) =>a.layer - b.layer) as ingredient}
      <ul>
        <li>{ingredient.name}</li>
      </ul>
    {/each}
  </div>
</div>
