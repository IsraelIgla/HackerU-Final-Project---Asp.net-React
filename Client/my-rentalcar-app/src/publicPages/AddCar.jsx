import UpdateFormForCar from "../components/UpdateFormForCar";
import { useNavigate } from "react-router-dom";

const AddCar = () => {
  const navigateTo = useNavigate();

  const onSave = () => {
    navigateTo("/CarList")
  }

  return (
    <div className="addCar"><UpdateFormForCar mode={"add"}
      args={{ onSave: onSave }} /></div>
  );
};

export default AddCar
