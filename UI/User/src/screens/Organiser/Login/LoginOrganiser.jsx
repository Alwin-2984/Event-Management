import LoginMidleware from "../../Components/Login/LoginMidleware";

const LoginOrganiser = () => {
  return (
    <div className="h-screen bg-[#F3F4F6]">
      <LoginMidleware isOrganiser={true} />
    </div>
  );
};

export default LoginOrganiser;
