import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary";
  size?: "sm" | "md" | "lg" | "market" | "marketDetail" | "profile";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles that apply to all buttons
    //const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none border";

    // Variant styles
    const variants = {
      default: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500",
      primary: "bg-primary text-primary-foreground border-primary-border cursor-pointer",
      secondary:
        "bg-secondary text-secondary-foreground border-secondary-border cursor-pointer",
      //outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground focus:ring-gray-500',
      //ghost: 'hover:bg-accent hover:text-accent-foreground focus:ring-gray-500',
    };

    // Size styles
    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "w-28 h-8 px-4 text-sm",
      lg: "w-32 h-10 text-xl",
      market: "w-32 h-8 text-xl",
      marketDetail: "w-full h-8 text-sm",
      profile: "w-22 h-9 px-4 text-sm",
    };

    // Combine all the classes
    const buttonClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim();

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
