Function.prototype.delegate=function(a){var b=this;return function(){return b.apply(a,arguments)}};Array.prototype.remove=function(a){for(var b=this.length;b--;)this[b]==a&&this.splice(b,1)};Array.prototype.contains=function(a){for(var b=this.length;b--;)if(this[b]==a)return true;return false};function Point(a,b){this.x=a;this.y=b}function Rectangle(a,b,c,d){this.x=a;this.y=b;this.width=c;this.height=d}
Rectangle.prototype.contains=function(a){return a.x>=this.x&&a.x<=this.x+this.width&&a.y>=this.y&&a.y<=this.y+this.height};Rectangle.prototype.inflate=function(a,b){this.x-=a;this.y-=b;this.width+=a+a+1;this.height+=b+b+1};Rectangle.prototype.union=function(a){var b=this.x<a.x?this.x:a.x,c=this.y<a.y?this.y:a.y;return new Rectangle(b,c,(this.x+this.width<a.x+a.width?a.x+a.width:this.x+this.width)-b,(this.y+this.height<a.y+a.height?a.y+a.height:this.y+this.height)-c)};
Rectangle.prototype.topLeft=function(){return new Point(this.x,this.y)};CanvasRenderingContext2D.prototype.dashedLine=function(a,b,c,d){this.moveTo(a,b);var e=c-a,f=d-b,g=Math.floor(Math.sqrt(e*e+f*f)/3);e=e/g;f=f/g;for(var h=0;h++<g;){a+=e;b+=f;h%2===0?this.moveTo(a,b):this.lineTo(a,b)}h%2===0?this.moveTo(c,d):this.lineTo(c,d)};
CanvasRenderingContext2D.prototype.roundedRect=function(a,b,c,d,e){this.beginPath();this.moveTo(a+e,b);this.lineTo(a+c-e,b);this.quadraticCurveTo(a+c,b,a+c,b+e);this.lineTo(a+c,b+d-e);this.quadraticCurveTo(a+c,b+d,a+c-e,b+d);this.lineTo(a+e,b+d);this.quadraticCurveTo(a,b+d,a,b+d-e);this.lineTo(a,b+e);this.quadraticCurveTo(a,b,a+e,b);this.closePath()};var Cursors={arrow:"default",grip:"pointer",cross:"pointer",move:"move",select:"pointer"};
function Connector(a,b){this.owner=a;this.template=b;this.connections=[];this.hover=false}Connector.prototype.getCursor=function(){return Cursors.grip};Connector.prototype.hitTest=function(a){if(a.width===0&&a.height===0)return this.getRectangle().contains(a.topLeft());return a.contains(this.getRectangle())};Connector.prototype.getRectangle=function(){var a=this.owner.getConnectorPosition(this);a=new Rectangle(a.x,a.y,0,0);a.inflate(3,3);return a};Connector.prototype.invalidate=function(){};
Connector.prototype.isValid=function(a){if(a===this)return false;var b=this.template.type.split(" ");if(!b.contains("[array]")&&this.connections.length==1)return false;if(a instanceof Connector){var c=a.template.type.split(" ");if(b[0]!=c[0]||this.owner==a.owner||b.contains("[in]")&&!c.contains("[out]")||b.contains("[out]")&&!c.contains("[in]")||!c.contains("[array]")&&a.connections.length==1)return false}return true};
Connector.prototype.paint=function(a,b){var c=this.getRectangle(),d=this.owner.owner.style.connectorBorder,e=this.owner.owner.style.connector;if(this.hover){d=this.owner.owner.style.connectorHoverBorder;e=this.owner.owner.style.connectorHover;this.isValid(b)||(e="#f00")}a.lineWidth=1;a.strokeStyle=d;a.lineCap="butt";a.fillStyle=e;a.fillRect(c.x-0.5,c.y-0.5,c.width,c.height);a.strokeRect(c.x-0.5,c.y-0.5,c.width,c.height);if(this.hover){d="description"in this.template?this.template.description:this.template.name;
a.textBaseline="bottom";a.font="8.25pt Tahoma";e=a.measureText(d);e.height=14;c=new Rectangle(c.x-Math.floor(e.width/2),c.y+e.height+6,e.width,e.height);e=new Rectangle(c.x,c.y,c.width,c.height);c.inflate(4,1);a.fillStyle="rgb(255, 255, 231)";a.fillRect(c.x-0.5,c.y-0.5,c.width,c.height);a.strokeStyle="#000";a.lineWidth=1;a.strokeRect(c.x-0.5,c.y-0.5,c.width,c.height);a.fillStyle="#000";a.fillText(d,e.x,e.y+13)}};
function Tracker(a,b){this.rectangle=new Rectangle(a.x,a.y,a.width,a.height);this.resizable=b;this.track=false}Tracker.prototype.hitTest=function(a){if(this.resizable)for(var b=-1;b<=+1;b++)for(var c=-1;c<=+1;c++)if(b!==0||c!==0){var d=new Point(b,c);if(this.getGripRectangle(d).contains(a))return d}if(this.rectangle.contains(a))return new Point(0,0);return new Point(-2,-2)};
Tracker.prototype.getGripRectangle=function(a){var b=new Rectangle(0,0,7,7);if(a.x<0)b.x=this.rectangle.x-7;if(a.x===0)b.x=this.rectangle.x+Math.floor(this.rectangle.width/2)-3;if(a.x>0)b.x=this.rectangle.x+this.rectangle.width+1;if(a.y<0)b.y=this.rectangle.y-7;if(a.y===0)b.y=this.rectangle.y+Math.floor(this.rectangle.height/2)-3;if(a.y>0)b.y=this.rectangle.y+this.rectangle.height+1;return b};
Tracker.prototype.getCursor=function(a){a=this.hitTest(a);if(a.x===0&&a.y===0)return this.track?Cursors.move:Cursors.select;if(a.x>=-1&&a.x<=+1&&a.y>=-1&&a.y<=+1&&this.resizable){if(a.x===-1&&a.y===-1)return"nw-resize";if(a.x===+1&&a.y===+1)return"se-resize";if(a.x===-1&&a.y===+1)return"sw-resize";if(a.x===+1&&a.y===-1)return"ne-resize";if(a.x===0&&a.y===-1)return"n-resize";if(a.x===0&&a.y===+1)return"s-resize";if(a.x===+1&&a.y===0)return"e-resize";if(a.x===-1&&a.y===0)return"w-resize"}return null};
Tracker.prototype.start=function(a,b){if(b.x>=-1&&b.x<=+1&&b.y>=-1&&b.y<=+1){this.handle=b;this.currentPoint=a;this.track=true}};
Tracker.prototype.move=function(a){var b=this.handle,c=new Point(0,0),d=new Point(0,0);if(b.x==-1||b.x===0&&b.y===0)c.x=a.x-this.currentPoint.x;if(b.y==-1||b.x===0&&b.y===0)c.y=a.y-this.currentPoint.y;if(b.x==+1||b.x===0&&b.y===0)d.x=a.x-this.currentPoint.x;if(b.y==+1||b.x===0&&b.y===0)d.y=a.y-this.currentPoint.y;b=new Point(this.rectangle.x,this.rectangle.y);var e=new Point(this.rectangle.x+this.rectangle.width,this.rectangle.y+this.rectangle.height);b.x+=c.x;b.y+=c.y;e.x+=d.x;e.y+=d.y;this.rectangle.x=
b.x;this.rectangle.y=b.y;this.rectangle.width=e.x-b.x;this.rectangle.height=e.y-b.y;this.currentPoint=a};Tracker.prototype.paint=function(a){if(this.resizable)for(var b=-1;b<=+1;b++)for(var c=-1;c<=+1;c++)if(b!==0||c!==0){var d=this.getGripRectangle(new Point(b,c));a.fillStyle="#ffffff";a.strokeStyle="#000000";a.lineWidth=1;a.fillRect(d.x-0.5,d.y-0.5,d.width-1,d.height-1);a.strokeRect(d.x-0.5,d.y-0.5,d.width-1,d.height-1)}};
function Element(a,b){this.template=a;this.rectangle=new Rectangle(b.x,b.y,a.defaultWidth,a.defaultHeight);this.content=a.defaultContent;this.owner=null;this.selected=this.hover=false;this.tracker=null;this.connectors=[];for(var c=0;c<a.connectorTemplates.length;c++)this.connectors.push(new Connector(this,a.connectorTemplates[c]))}Element.prototype.select=function(){this.selected=true;this.tracker=new Tracker(this.rectangle,"resizable"in this.template?this.template.resizable:false);this.invalidate()};
Element.prototype.deselect=function(){this.selected=false;this.invalidate();this.tracker=null};Element.prototype.getRectangle=function(){return this.tracker!==null&&this.tracker.track?this.tracker.rectangle:this.rectangle};Element.prototype.getPageRectangle=function(){var a=this.getRectangle();a=new Rectangle(a.x,a.y,a.width,a.height);var b=this.owner.canvas;a.x+=b.offsetLeft;a.y+=b.offsetTop;return a};
Element.prototype.setRectangle=function(a){this.invalidate();this.rectangle=a;if(this.tracker!==null)this.tracker.rectangle=new Rectangle(a.x,a.y,a.width,a.height);this.invalidate()};Element.prototype.paint=function(a){this.template.paint(this,a);this.selected&&this.tracker.paint(a)};Element.prototype.invalidate=function(){};Element.prototype.insertInto=function(a){this.owner=a;this.owner.elements.push(this)};
Element.prototype.remove=function(){this.invalidate();for(var a=0;a<this.connectors.length;a++)for(var b=this.connectors[a].connections,c=0;c<b.length;c++)b[c].remove();this.owner!==null&&this.owner.elements.contains(this)&&this.owner.elements.remove(this);this.owner=null};
Element.prototype.hitTest=function(a){if(a.width===0&&a.height===0){if(this.rectangle.contains(a.topLeft()))return true;if(this.tracker!==null&&this.tracker.track){var b=this.tracker.hitTest(a.topLeft());if(b.x>=-1&&b.x<=+1&&b.y>=-1&&b.y<=+1)return true}for(b=0;b<this.connectors.length;b++)if(this.connectors[b].hitTest(a))return true;return false}return a.contains(this.rectangle)};
Element.prototype.getCursor=function(a){if(this.tracker!==null){a=this.tracker.getCursor(a);if(a!==null)return a}if(window.event.shiftKey)return Cursors.add;return Cursors.select};Element.prototype.getConnector=function(a){for(var b=0;b<this.connectors.length;b++){var c=this.connectors[b];if(c.template.name==a)return c}return null};Element.prototype.getConnectorPosition=function(a){var b=this.getRectangle();a=a.template.position(this);a.x+=b.x;a.y+=b.y;return a};
Element.prototype.setContent=function(a){this.owner.setElementContent(this,a)};Element.prototype.getContent=function(){return this.content};function Connection(a,b){this.from=a;this.to=b;this.toPoint=null}Connection.prototype.select=function(){this.selected=true;this.invalidate()};Connection.prototype.deselect=function(){this.selected=false;this.invalidate()};
Connection.prototype.remove=function(){this.invalidate();this.from!==null&&this.from.connections.contains(this)&&this.from.connections.remove(this);this.to!==null&&this.to.connections.contains(this)&&this.to.connections.remove(this);this.to=this.from=null};Connection.prototype.insert=function(a,b){this.from=a;this.to=b;this.from.connections.push(this);this.from.invalidate();this.to.connections.push(this);this.to.invalidate();this.invalidate()};Connection.prototype.getCursor=function(){return Cursors.select};
Connection.prototype.hitTest=function(a){if(this.from!==null&&this.to!==null){var b=this.from.owner.getConnectorPosition(this.from),c=this.to.owner.getConnectorPosition(this.to);if(a.width!==0||a.height!==0)return a.contains(b)&&a.contains(c);a=a.topLeft();if(b.x>c.x){var d=c;c=b;b=d}d=new Rectangle(b.x,b.y,0,0);var e=new Rectangle(c.x,c.y,0,0);d.inflate(3,3);e.inflate(3,3);if(d.union(e).contains(a))if(b.x==c.x||b.y==c.y)return true;else if(b.y<c.y){b=d.x+d.width+(e.x+e.width-(d.x+d.width))*(a.y-
d.y)/(e.y-d.y);return a.x>d.x+(e.x-d.x)*(a.y-(d.y+d.height))/(e.y+e.height-(d.y+d.height))&&a.x<b}else{b=d.x+d.width+(e.x+e.width-(d.x+d.width))*(a.y-(d.y+d.height))/(e.y+e.height-(d.y+d.height));return a.x>d.x+(e.x-d.x)*(a.y-d.y)/(e.y-d.y)&&a.x<b}}return false};Connection.prototype.invalidate=function(){this.from!==null&&this.from.invalidate();this.to!==null&&this.to.invalidate()};
Connection.prototype.paint=function(a){a.strokeStyle=this.from.owner.owner.style.connection;a.lineWidth=this.hover?2:1;this.paintLine(a,this.selected)};Connection.prototype.paintTrack=function(a){a.strokeStyle=this.from.owner.owner.style.connection;a.lineWidth=1;this.paintLine(a,true)};
Connection.prototype.paintLine=function(a,b){if(this.from!==null){var c=this.from.owner.getConnectorPosition(this.from),d=this.to!==null?this.to.owner.getConnectorPosition(this.to):this.toPoint;if(c.x!=d.x||c.y!=d.y){a.beginPath();if(b)a.dashedLine(c.x,c.y,d.x,d.y);else{a.moveTo(c.x-0.5,c.y-0.5);a.lineTo(d.x-0.5,d.y-0.5)}a.closePath();a.stroke()}}};function Selection(a){this.currentPoint=this.startPoint=a}
Selection.prototype.paint=function(a){var b=this.getRectangle();a.lineWidth=1;a.beginPath();a.dashedLine(b.x-0.5,b.y-0.5,b.x-0.5+b.width,b.y-0.5);a.dashedLine(b.x-0.5+b.width,b.y-0.5,b.x-0.5+b.width,b.y-0.5+b.height);a.dashedLine(b.x-0.5+b.width,b.y-0.5+b.height,b.x-0.5,b.y-0.5+b.height);a.dashedLine(b.x-0.5,b.y-0.5+b.height,b.x-0.5,b.y-0.5);a.closePath();a.stroke()};
Selection.prototype.getRectangle=function(){var a=new Rectangle(this.startPoint.x<=this.currentPoint.x?this.startPoint.x:this.currentPoint.x,this.startPoint.y<=this.currentPoint.y?this.startPoint.y:this.currentPoint.y,this.currentPoint.x-this.startPoint.x,this.currentPoint.y-this.startPoint.y);if(a.width<0)a.width*=-1;if(a.height<0)a.height*=-1;return a};function ContainerUndoUnit(){this.undoUnits=[]}ContainerUndoUnit.prototype.add=function(a){this.undoUnits.push(a)};
ContainerUndoUnit.prototype.undo=function(){for(var a=0;a<this.undoUnits.length;a++)this.undoUnits[a].undo()};ContainerUndoUnit.prototype.redo=function(){for(var a=0;a<this.undoUnits.length;a++)this.undoUnits[a].redo()};ContainerUndoUnit.prototype.isEmpty=function(){if(this.undoUnits.length>0)for(var a=0;a<this.undoUnits.length;a++)if(!("isEmpty"in this.undoUnits[a])||!this.undoUnits[a].isEmpty())return false;return true};function InsertElementUndoUnit(a,b){this.element=a;this.owner=b}
InsertElementUndoUnit.prototype.undo=function(){this.element.remove()};InsertElementUndoUnit.prototype.redo=function(){this.element.insertInto(this.owner)};function DeleteElementUndoUnit(a){this.element=a;this.owner=this.element.owner}DeleteElementUndoUnit.prototype.undo=function(){this.element.insertInto(this.owner)};DeleteElementUndoUnit.prototype.redo=function(){this.element.remove()};function InsertConnectionUndoUnit(a,b,c){this.connection=a;this.from=b;this.to=c}
InsertConnectionUndoUnit.prototype.undo=function(){this.connection.remove()};InsertConnectionUndoUnit.prototype.redo=function(){this.connection.insert(this.from,this.to)};function DeleteConnectionUndoUnit(a){this.connection=a;this.from=a.from;this.to=a.to}DeleteConnectionUndoUnit.prototype.undo=function(){this.connection.insert(this.from,this.to)};DeleteConnectionUndoUnit.prototype.redo=function(){this.connection.remove()};
function ContentChangedUndoUnit(a,b){this.element=a;this.undoContent=a.content;this.redoContent=b}ContentChangedUndoUnit.prototype.undo=function(){this.element.content=this.undoContent};ContentChangedUndoUnit.prototype.redo=function(){this.element.content=this.redoContent};function TransformUndoUnit(a,b,c){this.element=a;this.undoRectangle=new Rectangle(b.x,b.y,b.width,b.height);this.redoRectangle=new Rectangle(c.x,c.y,c.width,c.height)}TransformUndoUnit.prototype.undo=function(){this.element.setRectangle(this.undoRectangle)};
TransformUndoUnit.prototype.redo=function(){this.element.setRectangle(this.redoRectangle)};function SelectionUndoUnit(){this.states=[]}SelectionUndoUnit.prototype.undo=function(){for(var a=0;a<this.states.length;a++)this.states[a].undo?this.states[a].value.select():this.states[a].value.deselect()};SelectionUndoUnit.prototype.redo=function(){for(var a=0;a<this.states.length;a++)this.states[a].redo?this.states[a].value.select():this.states[a].value.deselect()};
SelectionUndoUnit.prototype.select=function(a){this.update(a,a.selected,true)};SelectionUndoUnit.prototype.deselect=function(a){this.update(a,a.selected,false)};SelectionUndoUnit.prototype.update=function(a,b,c){for(var d=0;d<this.states.length;d++)if(this.states[d].value==a){this.states[d].redo=c;return}this.states.push({value:a,undo:b,redo:c})};SelectionUndoUnit.prototype.isEmpty=function(){for(var a=0;a<this.states.length;a++)if(this.states[a].undo!=this.states[a].redo)return false;return true};
function UndoService(){this.container=null;this.stack=[];this.position=0}UndoService.prototype.begin=function(){this.container=new ContainerUndoUnit};UndoService.prototype.cancel=function(){this.container=null};UndoService.prototype.commit=function(){if(!this.container.isEmpty()){this.stack.splice(this.position,this.stack.length-this.position);this.stack.push(this.container);this.redo()}this.container=null};UndoService.prototype.add=function(a){this.container.add(a)};
UndoService.prototype.undo=function(){if(this.position!==0){this.position--;this.stack[this.position].undo()}};UndoService.prototype.redo=function(){if(this.stack.length!==0&&this.position<this.stack.length){this.stack[this.position].redo();this.position++}};
function Graph(a){this.canvas=a;this.canvas.focus();this.context=this.canvas.getContext("2d");this.style={background:"#fff",connection:"#000",selection:"#000",connector:"#31456b",connectorBorder:"#fff",connectorHoverBorder:"#000",connectorHover:"#0c0"};this.mousePosition=new Point(0,0);this.undoService=new UndoService;this.elements=[];this.selection=this.newConnection=this.newElement=this.activeObject=this.activeTemplate=null;this.track=false;this.mouseDownHandler=this.mouseDown.delegate(this);this.mouseUpHandler=
this.mouseUp.delegate(this);this.mouseMoveHandler=this.mouseMove.delegate(this);this.doubleClickHandler=this.doubleClick.delegate(this);this.keyDownHandler=this.keyDown.delegate(this);this.keyUpHandler=this.keyUp.delegate(this);this.canvas.addEventListener("mousedown",this.mouseDownHandler,false);this.canvas.addEventListener("mouseup",this.mouseUpHandler,false);this.canvas.addEventListener("mousemove",this.mouseMoveHandler,false);this.canvas.addEventListener("dblclick",this.doubleClickHandler,false);
this.canvas.addEventListener("keydown",this.keyDownHandler,false);this.canvas.addEventListener("keyup",this.keyUpHandler,false)}
Graph.prototype.dispose=function(){if(this.canvas!==null){this.canvas.removeEventListener("mousedown",this.mouseDownHandler);this.canvas.removeEventListener("mouseup",this.mouseUpHandler);this.canvas.removeEventListener("mousemove",this.mouseMoveHandler);this.canvas.removeEventListener("dblclick",this.doubleClickHandler);this.canvas.removeEventListener("keydown",this.keyDownHandler);this.canvas.removeEventListener("keyup",this.keyUpHandler);this.context=this.canvas=null}};
Graph.prototype.mouseDown=function(a){a.preventDefault();this.canvas.focus();this.updateMousePosition(a);var b=this.mousePosition;if(a.button===0){this.newElement===null&&a.altKey&&this.createElement(this.activeTemplate);if(this.newElement!==null){this.undoService.begin();this.newElement.invalidate();this.newElement.rectangle=new Rectangle(b.x,b.y,this.newElement.rectangle.width,this.newElement.rectangle.height);this.newElement.invalidate();this.undoService.add(new InsertElementUndoUnit(this.newElement,
this));this.undoService.commit();this.newElement=null}else{this.selection=null;this.updateActiveObject(b);if(this.activeObject===null)this.selection=new Selection(b);else if(this.activeObject instanceof Connector){if(this.activeObject.isValid(null)){this.newConnection=new Connection(this.activeObject,null);this.newConnection.toPoint=b;this.activeObject.invalidate()}}else{if(!this.activeObject.selected){this.undoService.begin();var c=new SelectionUndoUnit;a.shiftKey||this.deselectAll(c);c.select(this.activeObject);
this.undoService.add(c);this.undoService.commit()}a=new Point(0,0);if(this.activeObject instanceof Element)a=this.activeObject.tracker.hitTest(b);for(c=0;c<this.elements.length;c++){var d=this.elements[c];d.tracker!==null&&d.tracker.start(b,a)}this.track=true}}}else if(a.button==2)if(this.activeObject!==null&&!this.activeObject.selected){this.undoService.begin();b=new SelectionUndoUnit;this.deselectAll(b);this.undoService.add(b);this.undoService.commit()}this.update();this.updateMouseCursor()};
Graph.prototype.mouseUp=function(a){a.preventDefault();this.updateMousePosition(a);var b=this.mousePosition;if(a.button===0){if(this.newConnection!==null){this.updateActiveObject(b);this.newConnection.invalidate();if(this.activeObject!==null&&this.activeObject instanceof Connector)if(this.activeObject!=this.newConnection.from&&this.activeObject.isValid(this.newConnection.from)){this.undoService.begin();this.undoService.add(new InsertConnectionUndoUnit(this.newConnection,this.newConnection.from,this.activeObject));
this.undoService.commit()}this.newConnection=null}if(this.selection!==null){this.undoService.begin();var c=new SelectionUndoUnit,d=this.selection.getRectangle();if(this.activeObject===null||!this.activeObject.selected)a.shiftKey||this.deselectAll(c);if(d.width!==0||d.weight!==0)this.selectAll(c,d);this.undoService.add(c);this.undoService.commit();this.selection=null}if(this.track){this.undoService.begin();for(a=0;a<this.elements.length;a++){c=this.elements[a];if(c.tracker!==null){c.tracker.track=
false;c.invalidate();d=c.getRectangle();var e=c.tracker.rectangle;if(d.x!=e.x||d.y!=e.y||d.width!=e.width||d.height!=e.height)this.undoService.add(new TransformUndoUnit(c,d,e))}}this.undoService.commit();this.track=false;this.updateActiveObject(b)}}this.update();this.updateMouseCursor()};
Graph.prototype.mouseMove=function(a){a.preventDefault();this.updateMousePosition(a);a=this.mousePosition;if(this.newElement!==null){this.newElement.invalidate();this.newElement.rectangle=new Rectangle(a.x,a.y,this.newElement.rectangle.width,this.newElement.rectangle.height);this.newElement.invalidate()}if(this.track)for(var b=0;b<this.elements.length;b++){var c=this.elements[b];if(c.tracker!==null){c.invalidate();c.tracker.move(a);c.invalidate()}}if(this.newConnection!==null){this.newConnection.invalidate();
this.newConnection.toPoint=a;this.newConnection.invalidate()}if(this.selection!==null)this.selection.currentPoint=a;this.updateActiveObject(a);this.update();this.updateMouseCursor()};
Graph.prototype.doubleClick=function(a){a.preventDefault();this.updateMousePosition(a);var b=this.mousePosition;if(a.button===0){this.updateActiveObject(b);if(this.activeObject!==null&&this.activeObject instanceof Element&&this.activeObject.template!==null&&"edit"in this.activeObject.template){this.activeObject.template.edit(this.activeObject,b);this.update()}}};
Graph.prototype.keyDown=function(a){if((a.ctrlKey||a.metaKey)&&!a.altKey){if(a.keyCode==65){this.undoService.begin();var b=new SelectionUndoUnit;this.selectAll(b,null);this.undoService.add(b);this.undoService.commit();this.update();this.updateActiveObject(this.mousePosition);this.updateMouseCursor();a.preventDefault()}if(a.keyCode==90&&!a.shiftKey){this.undoService.undo();this.update();this.updateActiveObject(this.mousePosition);this.updateMouseCursor();a.preventDefault()}if(a.keyCode==90&&a.shiftKey||
a.keyCode==89){this.undoService.redo();this.update();this.updateActiveObject(this.mousePosition);this.updateMouseCursor();a.preventDefault()}}if(a.keyCode==46||a.keyCode==8){this.deleteSelection();this.update();this.updateActiveObject(this.mousePosition);this.updateMouseCursor();a.preventDefault()}if(a.keyCode==27){this.newConnection=this.newElement=null;this.track=false;for(b=0;b<this.elements.length;b++){var c=this.elements[b];if(c.tracker!==null)c.tracker.track=false}this.update();this.updateActiveObject(this.mousePosition);
this.updateMouseCursor();a.preventDefault()}};Graph.prototype.keyUp=function(){this.updateMouseCursor()};
Graph.prototype.deleteSelection=function(){var a,b,c,d;this.undoService.begin();var e=[];for(a=0;a<this.elements.length;a++){d=this.elements[a];for(b=0;b<d.connectors.length;b++){var f=d.connectors[b];for(c=0;c<f.connections.length;c++){var g=f.connections[c];if((d.selected||g.selected)&&!e.contains(g)){this.undoService.add(new DeleteConnectionUndoUnit(g));e.push(g)}}}}for(a=0;a<this.elements.length;a++){d=this.elements[a];d.selected&&this.undoService.add(new DeleteElementUndoUnit(d))}this.undoService.commit()};
Graph.prototype.selectAll=function(a,b){for(var c=0;c<this.elements.length;c++){var d=this.elements[c];if(b===null||d.hitTest(b))a.select(d);for(var e=0;e<d.connectors.length;e++)for(var f=d.connectors[e],g=0;g<f.connections.length;g++){var h=f.connections[g];if(b===null||h.hitTest(b))a.select(h)}}};Graph.prototype.deselectAll=function(a){for(var b=0;b<this.elements.length;b++){var c=this.elements[b];a.deselect(c);for(var d=0;d<c.connectors.length;d++)for(var e=c.connectors[d],f=0;f<e.connections.length;f++)a.deselect(e.connections[f])}};
Graph.prototype.updateActiveObject=function(a){a=this.hitTest(a);if(a!=this.activeObject){if(this.activeObject!==null)this.activeObject.hover=false;this.activeObject=a;if(this.activeObject!==null)this.activeObject.hover=true}};
Graph.prototype.hitTest=function(a){var b,c,d,e,f,g=new Rectangle(a.x,a.y,0,0);for(a=0;a<this.elements.length;a++){d=this.elements[a];for(b=0;b<d.connectors.length;b++){e=d.connectors[b];if(e.hitTest(g))return e}}for(a=0;a<this.elements.length;a++){d=this.elements[a];if(d.hitTest(g))return d}for(a=0;a<this.elements.length;a++){d=this.elements[a];for(b=0;b<d.connectors.length;b++){e=d.connectors[b];for(c=0;c<e.connections.length;c++){f=e.connections[c];if(f.hitTest(g))return f}}}return null};
Graph.prototype.updateMouseCursor=function(){this.canvas.style.cursor=this.newConnection!==null?this.activeObject!==null&&this.activeObject instanceof Connector?this.activeObject.getCursor(this.mousePosition):Cursors.cross:this.activeObject!==null?this.activeObject.getCursor(this.mousePosition):Cursors.arrow};
Graph.prototype.updateMousePosition=function(a){this.mousePosition=new Point(a.pageX,a.pageY);for(a=this.canvas;a!==null;){this.mousePosition.x-=a.offsetLeft;this.mousePosition.y-=a.offsetTop;a=a.offsetParent}};Graph.prototype.addElement=function(a,b,c){this.activeTemplate=a;a=new Element(a,b);a.content=c;a.insertInto(this);a.invalidate();return a};Graph.prototype.createElement=function(a){this.activeTemplate=a;this.newElement=new Element(a,this.mousePosition);this.update();this.canvas.focus()};
Graph.prototype.addConnection=function(a,b){var c=new Connection(a,b);a.connections.push(c);b.connections.push(c);a.invalidate();b.invalidate();c.invalidate();return c};Graph.prototype.setElementContent=function(a,b){this.undoService.begin();this.undoService.add(new ContentChangedUndoUnit(a,b));this.undoService.commit();this.update()};
Graph.prototype.update=function(){var a,b,c,d,e,f;this.canvas.style.background=this.style.background;this.context.clearRect(0,0,this.canvas.width,this.canvas.height);var g=[];for(a=0;a<this.elements.length;a++){d=this.elements[a];for(b=0;b<d.connectors.length;b++){e=d.connectors[b];for(c=0;c<e.connections.length;c++){f=e.connections[c];if(!g.contains(f)){f.paint(this.context);g.push(f)}}}}for(a=0;a<this.elements.length;a++){this.context.save();this.elements[a].paint(this.context);this.context.restore()}for(a=
0;a<this.elements.length;a++){d=this.elements[a];for(b=0;b<d.connectors.length;b++){e=d.connectors[b];f=false;for(c=0;c<e.connections.length;c++)if(e.connections[c].hover)f=true;if(d.hover||e.hover||f)e.paint(this.context,this.newConnection!==null?this.newConnection.from:null);else this.newConnection!==null&&e.isValid(this.newConnection.from)&&e.paint(this.context,this.newConnection.from)}}if(this.newElement!==null){this.context.save();this.newElement.paint(this.context);this.context.restore()}this.newConnection!==
null&&this.newConnection.paintTrack(this.context);if(this.selection!==null){this.context.strokeStyle=this.style.selection;this.selection.paint(this.context)}};
