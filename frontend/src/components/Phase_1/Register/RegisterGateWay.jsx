import Register from "./Register";
import RegistrationClosed from "./RegisterClose";

const REGISTRATION_END_DATE = new Date("2026-02-05T23:59:59");

export default function RegisterGate() {
  const now = new Date();

  if (now > REGISTRATION_END_DATE) {
    return <RegistrationClosed />;
  }

  return <Register />;
}