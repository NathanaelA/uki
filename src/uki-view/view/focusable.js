var env = require('../../uki-core/env'),
    dom = require('../../uki-core/dom'),
    fun = require('../../uki-core/function');

var Focusable = {};

Focusable.focusableDom = function() {
    return this.dom();
};

Focusable._domForEvent = function(type) {
    if (type == 'focus' || type == 'blur') {
        return this.focusableDom();
    }
    return false;
};

fun.delegateProp(Focusable, 'tabIndex', 'focusableDom');


Focusable.focus = function() {
    this.focusableDom().focus();
    return this;
};

Focusable.blur = function() {
    this.focusableDom().blur();
    return this;
};

Focusable.hasFocus = function() {
    return this.focusableDom() == env.doc.activeElement;
};

Focusable.nextFocusable = function(wrapping, sameLevelOnly) {
    var p = this.parent();
    if (p === null) return;
    p = p._childViews;
    sameLevelOnly = !!sameLevelOnly;
    wrapping = !!wrapping;
    var length = p.length;

    var control = getNextControl(p, this._viewIndex+1, length, sameLevelOnly);
    if (!control && wrapping) {
        control = getNextControl(p, 0, this._viewIndex, sameLevelOnly);
    }
    return (control);
};

function getNextControl(views, start, end, sameLevelOnly) {
    var found=false, control=null;
    for (var i=start; i<end; i++) {
        if (views[i].focus && views[i].visible && views[i].visible() && !views[i].disabled()) {
            found = views[i]; break;
        }
        else if (!sameLevelOnly) {
            if (views[i]._childViews.length > 0) {
                found = getNextControl(views[i]._childViews, 0, views[i]._childViews.length, sameLevelOnly);
                if (found) break;
            }
        }
    }
    return (found);
}

Focusable.priorFocusable = function(wrapping, sameLevelOnly) {
    var p = this.parent();
    if (p === null) return;
    p = p._childViews;
    sameLevelOnly = !!sameLevelOnly;
    wrapping = !!wrapping;
    var length = p.length;

    var control = getPriorControl(p, this._viewIndex-1, 0, sameLevelOnly);
    if (!control && wrapping) control = getPriorControl(p, length-1, this._viewIndex+1, sameLevelOnly);
    return (control);
};


function getPriorControl(views, start, end, sameLevelOnly) {
    var found=false, control=null;
    for (var i=start; i>=end; i--) {
        if (views[i].focus && views[i].visible && views[i].visible() && !views[i].disabled()) {
            found = views[i]; break;
        }
        else if (!sameLevelOnly) {
            if (views[i]._childViews.length > 0) {
                found = getPriorControl(views[i]._childViews, views[i]._childViews.length-1, 0, sameLevelOnly);
                if (found) break;
            }
        }
    }
    return (found);
}



exports.Focusable = Focusable;
