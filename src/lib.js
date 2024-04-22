import {
  createDiv,
  createParagraph,
  createPre,
  createSpan,
  getElement,
} from "./framework.js";

export function externalContainerBuilderElement() {
  const ExternalWhiteWrapper = createDiv().appendToBody().setStyle({
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "#ffffff",
  });

  return createDiv().appendTo(ExternalWhiteWrapper).setStyle({
    border: "1px #000 solid",
    width: "fit-content",
    position: "absolute",
    transform: "translate(50%, 50%)",
  });
}

export function movementAreaBuilderElement(InternalBordedContainer) {
  const pre = createPre();
  pre.appendTo(InternalBordedContainer.element).setStyle({
    borderBottom: "1px #000 solid",
    width: "fit-content",
  });
  return pre;
}

export function scoreAreaBuilderElement(parent) {
  const score = createSpan();
  const scoreParagraph = createParagraph()
    .appendTo(parent.element)
    .appendChild(score);
  scoreParagraph.innerText = "Score: ";
  return score;
}

export function gameoverContainerBuilderElement(parent) {
  const gameover = createDiv().appendTo(parent).setStyle({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "none",
  });
  gameover.innerText = "GAME OVER";
  return gameover;
}
