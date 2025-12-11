import * as React from "react"
import { cn } from "@/lib/utils"

const FieldContext = React.createContext<{ id: string }>({ id: "" })

const useField = () => {
  const context = React.useContext(FieldContext)
  if (!context) {
    throw new Error("Field components must be used within a FieldGroup")
  }
  return context
}

// FieldGroup Component
interface FieldGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const FieldGroup = React.forwardRef<HTMLDivElement, FieldGroupProps>(
  ({ className, children, ...props }, ref) => {
    const id = React.useId()
    
    return (
      <FieldContext.Provider value={{ id }}>
        <div
          ref={ref}
          className={cn("flex flex-col gap-4", className)}
          {...props}
        >
          {children}
        </div>
      </FieldContext.Provider>
    )
  }
)
FieldGroup.displayName = "FieldGroup"

// Field Component
interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2", className)}
        {...props}
      />
    )
  }
)
Field.displayName = "Field"

// FieldLabel Component
interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string
  children: React.ReactNode
}

const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, htmlFor, children, ...props }, ref) => {
    const { id } = useField()
    
    return (
      <label
        ref={ref}
        htmlFor={htmlFor || `field-${id}`}
        className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
        {...props}
      >
        {children}
      </label>
    )
  }
)
FieldLabel.displayName = "FieldLabel"

// FieldDescription Component
interface FieldDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

const FieldDescription = React.forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      >
        {children}
      </p>
    )
  }
)
FieldDescription.displayName = "FieldDescription"

// FieldSeparator Component
interface FieldSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const FieldSeparator = React.forwardRef<HTMLDivElement, FieldSeparatorProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative my-2", className)}
        {...props}
      >
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        {children && (
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {children}
            </span>
          </div>
        )}
      </div>
    )
  }
)
FieldSeparator.displayName = "FieldSeparator"

// FieldError Component (Optional tambahan)
interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-destructive", className)}
        {...props}
      >
        {children}
      </p>
    )
  }
)
FieldError.displayName = "FieldError"

export {
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription,
  FieldSeparator,
  FieldError,
}