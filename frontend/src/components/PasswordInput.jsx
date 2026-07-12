import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

/**
 * Campo reutilizable para contraseñas.
 *
 * El icono se presenta dentro de la misma casilla. Al presionarlo,
 * alterna entre mostrar y ocultar el texto sin enviar el formulario.
 */
export default function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  autoComplete = "current-password",
  required = false,
  className = "",
  helpText = ""
}) {
  const [mostrar, setMostrar] = useState(false);

  return (
    <Form.Group className={className}>
      <Form.Label htmlFor={name}>{label}</Form.Label>

      <div className="password-input-wrapper">
        <Form.Control
          id={name}
          name={name}
          type={mostrar ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
        />

        <Button
          type="button"
          className="password-eye"
          onClick={() => setMostrar((valorActual) => !valorActual)}
          aria-label={mostrar ? "Ocultar contraseña" : "Mostrar contraseña"}
          title={mostrar ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {mostrar ? <FaEyeSlash /> : <FaEye />}
        </Button>
      </div>

      {helpText && (
        <Form.Text className="password-help-text">
          {helpText}
        </Form.Text>
      )}
    </Form.Group>
  );
}
