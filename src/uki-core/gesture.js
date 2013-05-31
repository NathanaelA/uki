var utils = require('./utils'),
    env = require('./env'),
    evt = require('./event');

var gesture = {
    draggable: null,
    position: null,
    cursor: null
};

var handlers = {},
    mark = '__draggesturebound';

// add single drag set of drag events for an element
// regardless of the number of listeners
var addDraggestures = {
    setup: function(el) {
        if (el[mark]) {
            el[mark]++;
        } else {
            el[mark] = 1;
            evt.on(el, 'mousedown touchstart', dragGestureStart);
        }
    },
    teardown: function(el) {
        el[mark]--;
        if (!el[mark]) {
            evt.removeListener(el, 'mousedown touchstart', dragGestureStart);
        }
    }
};

// drag gestures
utils.extend(evt.special, {
    draggesturestart: addDraggestures,
    draggestureend: addDraggestures,
    draggesture: addDraggestures
});

function startGesture (el, e) {
    if (gesture.draggable) return;
    gesture.draggable = e.draggable || el;
    if (e.cursor) {
        gesture.cursor = env.doc.body.style.cursor;
        env.doc.body.style.cursor = e.cursor;
    }
    evt.on(env.doc, 'mousemove scroll touchmove', dragGesture);
    evt.on(env.doc, 'mouseup dragend touchend touchcancel', dragGestureEnd);
    evt.on(env.doc, 'selectstart mousedown touchstart', evt.preventDefaultHandler);
}

function stopGesture () {
    gesture.draggable = null;
    env.doc.body.style.cursor = gesture.cursor;
    gesture.cursor = null;
    evt.removeListener(env.doc, 'mousemove scroll touchmove', dragGesture);
    evt.removeListener(env.doc, 'mouseup dragend touchend touchcancel', dragGestureEnd);
    evt.removeListener(env.doc, 'selectstart mousedown touchstart', evt.preventDefaultHandler);
}

function addOffset(e) {
    e.dragOffset = {
        x: e.pageX - gesture.position.x,
        y: e.pageY - gesture.position.y
    };
}

function addStartPosition(e) {
  e.startPosition = gesture.position;
}
function addMovement(e) {
  e.movementSinceLastEvent = {
    x: e.pageX - ((gesture.lastPosition && gesture.lastPosition.x) || 0),
    y: e.pageY - ((gesture.lastPosition && gesture.lastPosition.y) || 0)
  }
}

function dragGestureStart (e) {
    e = evt.createEvent(e, { type: 'draggesturestart', simulatePropagation: true });
    e.dragOffset = {
        x: 0,
        y: 0
    };
    evt.trigger(this, e);
    if (!e.isDefaultPrevented()) {
        gesture.position = { x: e.pageX, y: e.pageY };
        startGesture(this, e);
    }
    gesture.lastPosition = {x: e.pageX, y: e.pageY};
    evt.destroyEvent(e);
}

function dragGesture (e) {
    e = evt.createEvent(e, { type: 'draggesture', simulatePropagation: true });
    addOffset(e);
    addStartPosition(e);
    addMovement(e);
    evt.trigger(gesture.draggable, e);

    if (e.isDefaultPrevented()) stopGesture(gesture.draggable);
    gesture.lastPosition = {x: e.pageX, y: e.pageY};

    evt.destroyEvent(e);
}

function dragGestureEnd (e) {
    e = evt.createEvent(e, { type: 'draggestureend', simulatePropagation: true });
    addOffset(e);
    addStartPosition(e);
    addMovement(e);
    e.lastOffset = gesture.lastOffset;
    evt.trigger(gesture.draggable, e);

    stopGesture(gesture.draggable);
    evt.destroyEvent(e);
}

module.exports = gesture;
