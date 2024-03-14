function encodeReserved(str: string) {
  return str
    .split(/(%[0-9A-Fa-f]{2})/g)
    .map(function (part) {
      if (!/%[0-9A-Fa-f]/.test(part)) {
        part = encodeURI(part).replace(/%5B/g, '[').replace(/%5D/g, ']');
      }
      return part;
    })
    .join('');
}

function encodeUnreserved(str: string) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

function encodeValue(
  operator: string | null,
  value: string,
  key?: string | null
) {
  value =
    operator === '+' || operator === '#'
      ? encodeReserved(value)
      : encodeUnreserved(value);

  if (key) {
    return encodeUnreserved(key) + '=' + value;
  } else {
    return value;
  }
}

function isDefined(value: any) {
  return value !== undefined && value !== null;
}

function isKeyOperator(operator: string | null) {
  return operator === ';' || operator === '&' || operator === '?';
}

function getValues(
  context: { [x: string]: any },
  operator: string | null,
  key: string,
  modifier: string
) {
  let value = context[key],
    result = [];

  if (isDefined(value) && value !== '') {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      value = value.toString();

      if (modifier && modifier !== '*') {
        value = value.substring(0, parseInt(modifier, 10));
      }

      result.push(
        encodeValue(operator, value, isKeyOperator(operator) ? key : null)
      );
    } else {
      if (modifier === '*') {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            result.push(
              encodeValue(operator, value, isKeyOperator(operator) ? key : null)
            );
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        let tmp: Array<string> = [];

        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            tmp.push(encodeValue(operator, value));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }

        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + '=' + tmp.join(','));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(','));
        }
      }
    }
  } else {
    if (operator === ';') {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === '' && (operator === '&' || operator === '?')) {
      result.push(encodeUnreserved(key) + '=');
    } else if (value === '') {
      result.push('');
    }
  }
  return result;
}

export function parseTemplate(template: string) {
  let operators = ['+', '#', '.', '/', ';', '?', '&'];

  return {
    expand: function (context: { [x: string]: any }) {
      return template.replace(
        /\{([^{}]+)}|([^{}]+)/g,
        function (_, expression, literal) {
          if (expression) {
            let operator: string | null = null,
              values: any[] = [];

            if (operators.indexOf(expression.charAt(0)) !== -1) {
              operator = expression.charAt(0);
              expression = expression.substring(1);
            }

            expression.split(/,/g).forEach(function (variable: string) {
              let tmp = /([^:*]*)(?::(\d+)|(\*))?/.exec(variable);
              values.push.apply(
                values,
                getValues(context, operator, tmp![1], tmp![2] || tmp![3])
              );
            });

            if (operator && operator !== '+') {
              let separator = ',';

              if (operator === '?') {
                separator = '&';
              } else if (operator !== '#') {
                separator = operator;
              }
              return (
                (values.length !== 0 ? operator : '') + values.join(separator)
              );
            } else {
              return values.join(',');
            }
          } else {
            return encodeReserved(literal);
          }
        }
      );
    },
  };
}
