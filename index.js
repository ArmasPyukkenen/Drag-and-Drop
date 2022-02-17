const SQUARE_MAKER = document.querySelector('.square-maker');
const DROPZONE_GRID = document.querySelector('.dropzone_grid');
const DROPZONE_COORDINATE = document.querySelector('.dropzone_coordinate');

//Helper functions

function checkIntersection(box1, box2) {
    const intersectX = !(box1.x > box2.x + box2.width || box1.x + box1.width < box2.x);
    const intersectY = !(box1.y > box2.y + box2.height || box1.y + box1.height < box2.y);
    return intersectX && intersectY;
}

function calculateDistance(coord1, coord2) {
    return Math.sqrt((coord1.x - coord2.x)**2 + (coord1.y - coord2.y)**2); 
}

function createDraggableSquare() {
    const square = document.createElement('div');
    square.classList.add('draggable', 'draggable_square');
    const boundRect = SQUARE_MAKER.getBoundingClientRect();
    console.log(boundRect);
    square.style.top = boundRect.top + 'px';
    square.style.left = boundRect.left + 'px';
    square.style.backgroundColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    document.body.append(square);
    return square;
}

//Adding Element to DropZone

function addElementToCoordinateDropzone(grid, element) {
    const gridBoundRect = grid.getBoundingClientRect();
    const elemBoundRect = element.getBoundingClientRect();
    if(!checkIntersection(gridBoundRect, elemBoundRect)) {
        return false;
    }
    element.style.top = elemBoundRect.y - gridBoundRect.y + 'px';
    element.style.left = elemBoundRect.x - gridBoundRect.x + 'px';
    grid.append(element);
    return true;
}

function addElementToGridDropzone (grid, element) {
    const gridBoundRect = grid.getBoundingClientRect();
    const elemBoundRect = element.getBoundingClientRect();
    if(!checkIntersection(gridBoundRect, elemBoundRect)) {
        return false;
    }
    let targetIndex = 0;
    let minDistance = calculateDistance(elemBoundRect, grid.children[0].getBoundingClientRect());
    for(let i = 1; i < grid.children.length; i++) {
        const currentDistance = calculateDistance(elemBoundRect, grid.children[i].getBoundingClientRect());
        if(currentDistance < minDistance) {
            targetIndex = i;
            minDistance = currentDistance;
        }
    }
    const targetContainer = grid.children[targetIndex];
    element.style.top = '0px';
    element.style.left = '0px';
    targetContainer.innerHtml = '';
    targetContainer.append(element);
    return true;
}

//EventHandling

const dragEventManager = {
    eventListeners : [],
    addEvent: function(target, eventName, handler) {
        this.eventListeners.push({target, eventName, handler});
        target.addEventListener(eventName, handler);
    },
    clearEvents: function() {
        this.eventListeners.forEach(eventData => {
            eventData.target.removeEventListener(eventData.eventName, eventData.handler);
        })
    },
    startDrag: function(draggAbleObject, offsetX, offsetY) {
        this.addEvent(document, 'pointermove', (e) => {
            draggAbleObject.style.top = e.clientY - offsetY + 'px';
            draggAbleObject.style.left = e.clientX - offsetX + 'px';
        })
        this.addEvent(document, 'pointerup', (e) => {
            if(
                !addElementToCoordinateDropzone(DROPZONE_COORDINATE, draggAbleObject) 
                && !addElementToGridDropzone(DROPZONE_GRID, draggAbleObject)
            ) {
                draggAbleObject.remove();
            }
            this.clearEvents();
        })
    }
}

SQUARE_MAKER.addEventListener('pointerdown', (e) => {
    dragEventManager.startDrag(createDraggableSquare(), e.offsetX, e.offsetY);
})