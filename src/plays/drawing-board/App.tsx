import { clearCanvas, drawStroke, setCanvasSize } from "./utils/canvasUtils";
import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { beginStroke, updateStroke } from "./modules/currentStroke/slice";
import { endStroke } from "./modules/sharedActions";
import { strokesSelector } from "./modules/strokes/slice";
import { currentStrokeSelector } from "./modules/currentStroke/slice";
import { historyIndexSelector } from "./modules/historyIndex/slice";
import { ColorPanel } from "./shared/ColorPanel";
import { EditPanel } from "./shared/EditPanel";
import { useCanvas } from "./CanvasContext";
import { FilePanel } from "./shared/FilePanel";

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 768;

function App() {
  const canvasRef = useCanvas();
  const historyIndex = useSelector(historyIndexSelector);
  const currentStroke = useSelector(currentStrokeSelector);

  const strokes = useSelector(strokesSelector);
  const dispatch = useDispatch();
  const isDrawing = !!currentStroke.points.length;

  const getCanvasWithContext = useCallback(
    (canvas = canvasRef.current) => {
      return { canvas, context: canvas?.getContext("2d") };
    },
    [canvasRef]
  ); // using useCallback to tackle missing dependency issues with useEffect

  // to prepare the canvas for drawing when we open the app
  useEffect(() => {
    const { canvas, context } = getCanvasWithContext();
    if (!canvas || !context) {
      return;
    }
    setCanvasSize(canvas, CANVAS_WIDTH, CANVAS_HEIGHT);

    context.lineJoin = "round";
    context.lineCap = "round";
    context.lineWidth = 5;
    context.strokeStyle = "black";

    clearCanvas(canvas);
  }, [getCanvasWithContext]);
  //set the canvas side to the predefined values,
  //we set the strokes style and then we clear the canvas, preparing it for the first strokes.

  // side-effect to handle the currentStroke updates.
  useEffect(() => {
    const { context } = getCanvasWithContext();
    if (!context) {
      return;
    }
    requestAnimationFrame(() =>
      drawStroke(context, currentStroke.points, currentStroke.color)
    );
  }, [currentStroke, getCanvasWithContext]);

  // Canvas Events
  const startDrawing = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;

    dispatch(beginStroke({ x: offsetX, y: offsetY }));
  };
  const endDrawing = () => {
    if (isDrawing) {
      dispatch(endStroke({ historyIndex, stroke: currentStroke }));
    }
  };
  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;

    dispatch(updateStroke({ x: offsetX, y: offsetY }));
  };

  //useEffect that will observe the historyIndex value:
  useEffect(() => {
    const { canvas, context } = getCanvasWithContext();
    if (!context || !canvas) {
      return;
    }
    requestAnimationFrame(() => {
      clearCanvas(canvas);

      strokes.slice(0, strokes.length - historyIndex).forEach((stroke) => {
        drawStroke(context, stroke.points, stroke.color);
      });
    });
  }, [getCanvasWithContext, historyIndex, strokes]);
  //Every time the historyIndex gets updated we clear the screen and then draw only the strokes that weren’t undone.

  return (
    <div className="window">
      <div className="title-bar">
        <div className="title-bar-text">Redux Paint</div>
        <div className="title-bar-controls">
          <button aria-label="Close" />
        </div>
      </div>
      <EditPanel />
      <ColorPanel />
      <FilePanel />
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
    </div>
  );
}

export default App;