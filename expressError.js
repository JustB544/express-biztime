/** ExpressError extends the normal JS error so we can easily
 *  add a status when we make an instance of it.
 *
 *  The error-handling middleware will return this.
 */

class ExpressError extends Error {
  constructor(message, status, error=null) {
    super();
    this.message = message;
    this.status = status;
    if (error) {
      this.cause = error;
    }
    console.error(this.stack);
  }
}


module.exports = ExpressError;