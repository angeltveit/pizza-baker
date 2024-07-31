import { crossfade } from 'svelte/transition';
import { quintOut } from 'svelte/easing';
import { browser } from "$app/environment"



export const [send, receive] = crossfade({
	duration: (d) => Math.sqrt(d * 200),

	fallback(node, params) {
		const style = getComputedStyle(node);
		const transform = style.transform === 'none' ? '' : style.transform;

		return {
			duration: 600,
			easing: quintOut,
			css: (t) => `
				transform: ${transform} scale(${t});
				opacity: ${t}
			`
		};
	}
});

const dropzones = []
export let isDragging = false


let dragDataTransfer = {}
let privateDataTransfer = {}

export function draggable(node, transferData) {

	let state = transferData;
  const { onDrag } = state ?? {}

  node.style.userSelect = 'none'
  node.style.touchAction = 'none'
  
  Array.from(node.children).forEach(child => {
    child.style.pointerEvents = 'none'
  })

	function handle_dragstart(e) {
    console.log('drag start', node)
		isDragging = true
    dragDataTransfer = {
      node,
      ...transferData,
      ...privateDataTransfer,
    }
    node.classList.add('dragging')

    
    const previewNode = document.createElement('div')
    const cloned = node.cloneNode(true)
    previewNode.append(cloned)
    
    const posX = e.touches ? e.touches[0].clientX : e.clientX
    const posY = e.touches ? e.touches[0].clientY : e.clientY

    previewNode.style.setProperty('position', 'fixed')
    previewNode.style.setProperty('user-select', 'none')
    previewNode.style.setProperty('pointer-events', 'none')
    previewNode.style.setProperty('left', posX + 'px')
    previewNode.style.setProperty('top', posY + 'px')
    previewNode.style.setProperty('z-index', '1000')
    dragDataTransfer.previewNode = previewNode

    document.body.append(previewNode)
    
    onDrag?.({ node, transferData })
	}

  function handle_touchmove(e) {
    
    const touch = e.touches[0]
    let element = document.elementFromPoint(touch.clientX, touch.clientY)

    if(!element?.classList.contains('dropzone')) {
      const maybe = element.closest('.dropzone')
      if(maybe) element = maybe
    }

    dropzones.forEach(zone => {
      if(zone === element && !zone.classList.contains('dragging')) {
        return zone.classList.add('dragover')
      }
      zone.classList.remove('dragover')
    })
  }

  function handle_touchend(e) {
    const touch = e.changedTouches[0]
    let element = document.elementFromPoint(touch.clientX, touch.clientY)
    console.log({element})
    dragDataTransfer.node.classList.remove('dragging')

    if(!element?.classList.contains('dropzone')) {
      const maybe = element.closest('.dropzone')
      if(maybe) element = maybe
    }

    dropzones.forEach(zone => {
      console.log('looping')
      console.log({ dropzones, zone, element })

      if(zone === element) {
        console.log('dispatch')
        element?.dispatchEvent(new MouseEvent('mouseup'))
      }
      
      zone.classList.remove('dragover')
    })

    console.log({dragDataTransfer})
    console.log('bitch')

    if(dragDataTransfer.previewNode) {
      dragDataTransfer.previewNode.remove()
    }
    dragDataTransfer = {}
  }

	node.addEventListener('mousedown', handle_dragstart)
  node.addEventListener('touchstart', handle_dragstart)
  node.addEventListener('touchmove', handle_touchmove)
  node.addEventListener('touchend', handle_touchend)
  
	return {
		update(transferData) {
			state = transferData;
		},

		destroy() {
			node.removeEventListener('mousedown', handle_dragstart)
      node.removeEventListener('touchstart', handle_dragstart)
      node.removeEventListener('touchmove', handle_touchmove)
      node.removeEventListener('touchend', handle_touchend)
		}
	};
}

export function dragzone(node) {
  let rects = node.getBoundingClientRect()
  
  privateDataTransfer.dragzone = node

  function handle_dragging(e) {
    if(!isDragging) return
    
    if(dragDataTransfer.previewNode) {
      const posX = e.touches ? e.touches[0].clientX : e.clientX
      const posY = e.touches ? e.touches[0].clientY : e.clientY
      dragDataTransfer.previewNode.style.setProperty('left', posX + 'px')
      dragDataTransfer.previewNode.style.setProperty('top', posY + 'px')
    }
    dropzones.forEach(zone => {
      zone.classList.remove('dragover')
    })
  }

  function handle_drag_end() {
    isDragging = false
    if(!dragDataTransfer.node) return
    dragDataTransfer.node.classList.remove('dragging')
    dropzones.forEach(zone => {
      zone.classList.remove('dragover')
    })

    if(dragDataTransfer.previewNode) {
      dragDataTransfer.previewNode.remove()
    }
    
    dragDataTransfer = {}
  }


  window.addEventListener('mouseup', handle_drag_end)
  document.body.addEventListener('mousemove', handle_dragging)
  document.body.addEventListener('touchmove', handle_dragging)

  return {
    update() {
      rects = node.getBoundingClientRect()
    },
    destroy() {
      window.removeEventListener('mouseup', handle_drag_end)
      document.body.removeEventListener('mousemove', handle_dragging)
      document.body.removeEventListener('touchmove', handle_dragging)
    }
  }
}

/**
 * 
 * @param {HTMLElement} node 
 * @param {{onDropzone: (data: unknown)=>void}} options 
 * @returns 
 */
export function dropzone(node, options) {
	let state = {
		...options
	}
  node.classList.add('dropzone')
  privateDataTransfer.onDropzone = state.onDropzone
  
  dropzones.push(node)

	function handle_dragover(e) {
    if(!isDragging) return

    e.stopPropagation()
		if(node === dragDataTransfer.node) return

    dropzones.forEach(zone => {
      if(zone === node && !zone.classList.contains('dragging')) {
        return zone.classList.add('dragover')
      }
      zone.classList.remove('dragover')
    })
	}

	function handle_drop(e) {
    console.log('HAAAAAAAALLO')
    e.stopPropagation()
    isDragging = false
    console.log('run the drop thing')
		state.onDropzone(dragDataTransfer, e);
	}

	
	node.addEventListener('mouseup', handle_drop);
  node.addEventListener('touchend', handle_drop)
  node.addEventListener('mousemove', handle_dragover)
  node.addEventListener('touchmove', handle_dragover)


	return {
		update(options) {
			state = {
				dropEffect: 'move',
				dragover_class: 'droppable',
				...options
			};
      privateDataTransfer.onDropzone = state.onDropzone
		},

		destroy() {
			node.removeEventListener('mouseup', handle_drop);
      node.removeEventListener('touchend', handle_drop);
      node.removeEventListener('mousemove', handle_dragover)
      node.removeEventListener('touchmove', handle_dragover)
		}
	};
}