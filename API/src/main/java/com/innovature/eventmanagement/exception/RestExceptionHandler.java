package com.innovature.eventmanagement.exception;

import com.innovature.eventmanagement.view.ResponseView;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingPathVariableException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

@ControllerAdvice
@RestControllerAdvice
public class RestExceptionHandler {

  private static final Logger LOGGER = LoggerFactory.getLogger(RestExceptionHandler.class);

  @ExceptionHandler(value = { MethodArgumentNotValidException.class })
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public List<ResponseView> formValidation(MethodArgumentNotValidException ex) {
    return ex.getBindingResult().getFieldErrors().stream().map(x -> {
      String err = x.getDefaultMessage();
      String[] arrOfError = err.split("-", 2);
      String errorCode = null;
      String errorMessage = null;
      try {
        if (arrOfError.length > 1) {
          errorCode = arrOfError[0];
          errorMessage = arrOfError[1];
        } else {
          errorMessage = err;
        }
      } catch (Exception e) {
        // Exception
      }
      if (errorMessage == null) {
        errorMessage = err;
      }

      return new ResponseView(errorMessage, errorCode);
    }).toList();
  }


  @ExceptionHandler(value = { ResponseStatusException.class })
  public ResponseEntity<Object> responseStatus(ResponseStatusException ex) {
    String reason = ex.getReason();
    String[] arrOfStr;

    if (reason != null) {
      arrOfStr = reason.split("-", 2);
    } else {
      arrOfStr = new String[0];
    }

    String errorCode = null;
    String errorMessage = null;
    try {
      if (arrOfStr.length > 1) {
        errorCode = arrOfStr[0];
        errorMessage = arrOfStr[1];
      } else {
        errorMessage = ex.getReason();
      }
    } catch (Exception e) {
      // Exception
    }
    if (errorMessage == null) {
      String field = null;
      if (errorCode != null && errorCode.contains("java.lang.NumberFormatException")) {
        field = errorCode.replaceAll("^.*for property '(.*)';.*$", "$1");
      }
      if (field != null && !"".equals(field)) {
        errorCode = "invalid " + field;
      }
      errorMessage = errorCode;
    }
    LOGGER.warn(ex.getMessage());
    ResponseView responseView = new ResponseView(errorMessage, errorCode);
    return new ResponseEntity<>(responseView, null, ex.getStatus());
  }

  @ExceptionHandler(value = { HttpRequestMethodNotSupportedException.class })
  @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
  public ResponseView methodNotSupportedException(HttpRequestMethodNotSupportedException ex) {
    LOGGER.warn(ex.getMessage());
    return new ResponseView("invalid method type", "8002");
  }

  @ExceptionHandler(value = { HttpMediaTypeNotSupportedException.class })
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseView mediaTypeNotAccepted(HttpMediaTypeNotSupportedException ex) {
    LOGGER.warn(ex.getMessage());
    return new ResponseView(" invalid content type", "8001");
  }

  @ExceptionHandler(value = { Exception.class })
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseView unKnownException(Exception ex) {
    LOGGER.warn(ex.getMessage());
    ex.printStackTrace();
    return new ResponseView(ex.getMessage(), "1933");
  }

  @ExceptionHandler(value = { IllegalArgumentException.class })
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseView illegalException(IllegalArgumentException ex) {
    LOGGER.warn(ex.getMessage());
    return new ResponseView("Invalid input arguments", "1929");
  }

  @ExceptionHandler(value = { HttpMessageNotReadableException.class })
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseView validException(HttpMessageNotReadableException ex) {
    LOGGER.warn(ex.getMessage());

    return new ResponseView("Invalid JSON", "1930");
  }

  @ExceptionHandler(value = { MethodArgumentTypeMismatchException.class })
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseView typeMismatchException(MethodArgumentTypeMismatchException ex) {
    LOGGER.warn(ex.getMessage());
    Class<?> requiredType = ex.getRequiredType();
    String errorMessage = (requiredType != null) ? (ex.getName() + " should be of type " + requiredType.getName())
        : "Type mismatch occurred";
    return new ResponseView(errorMessage, "1931");
  }

  @ExceptionHandler(InvalidUrlException.class)
  public ResponseView handleInvalidUrlException(InvalidUrlException ex) {
    return new ResponseView("invalid url", "8000");
  }

  @ExceptionHandler(UsernameNotFoundException.class)
  @ResponseBody
  public ResponseEntity<ResponseView> handleTokenExpiredException(UsernameNotFoundException e) {
    ResponseView response = new ResponseView("Authorization token expired", "1006");
    return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
  }

  // for path variable given whitespace scenarios
  @ExceptionHandler(MissingPathVariableException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseView handleMissingPathVariableException(MissingPathVariableException ex) {
    switch (ex.getVariableName()) {
    case "categoryId":
      return new ResponseView("Category id is required", "3012");
    case "subCategoryId":
      return new ResponseView("Required SubCategory id", "4090");
    case "id":
      return new ResponseView("Id Required", "2700");
    case "productId":
      return new ResponseView("product id required", "2840");
    case "cartId":
      return new ResponseView("cart Id Required", "2867");
    case "addressId":
      return new ResponseView("Address Id Required", "2103");
    case "paymentId":
      return new ResponseView("payment method  type Id Required", "2114");
    default:
      return new ResponseView("Bad Request", "4000");
    }
  }

  @ExceptionHandler(MissingServletRequestParameterException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseView handleMissingPathParamException(MissingServletRequestParameterException ex) {
    String parameterName = ex.getParameterName();

    if ("btnValue".equals(parameterName)) {
      return new ResponseView("unable to perform this action", "5115");
    } else {
      return new ResponseView("Bad Request", "4000");
    }
  }
}
