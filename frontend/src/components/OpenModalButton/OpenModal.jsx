// frontend/src/components/OpenModalButton/OpenModalButton.jsx

import { useModal } from "../../context/modal";

function OpenModalButton({
  modalComponent, 
  buttonText,
  onButtonClick, 
  onModalClose,
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick();
  };

  return <button onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;