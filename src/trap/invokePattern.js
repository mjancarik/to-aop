export default function invokePattern(pattern, meta) {
  if (!pattern) {
    return;
  }

  if (Array.isArray(pattern)) {
    return pattern.map((rule) => {
      return Reflect.apply(rule, rule.context, [meta]);
    });
  } else {
    const method = typeof pattern === 'function' ? pattern : pattern.method;
    return Reflect.apply(method, pattern.context, [meta]);
  }
}
