class ApiLimiter {
  private queue: Array<() => Promise<unknown>> = [];
  private executing = false;
  private timestamps: number[] = [];
  private readonly MAX_REQUESTS_PER_SECOND = 3;
  private readonly MAX_REQUESTS_PER_MINUTE = 60;
  private readonly REQUEST_DELAY = 666; 

  async executeRequest<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(() => {
        return fn()
          .then(resolve)
          .catch(reject);
      });
      
      if (!this.executing) {
        this.processQueue();
      }
    });
  }

  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      this.executing = false;
      return;
    }

    // Check rate limits (max 3 requests per second and 60 per minute)
    const now = Date.now();
    this.timestamps = this.timestamps.filter(timestamp => now - timestamp < 60000); // Keep last minute's timestamps
    
    // Check per-minute limit
    if (this.timestamps.length >= this.MAX_REQUESTS_PER_MINUTE) {
      // Wait 1 minute before processing more requests
      await new Promise(resolve => setTimeout(resolve, 60000));
      this.processQueue(); // Retry processing
      return;
    }
    
    // Check per-second limit
    const recentRequests = this.timestamps.filter(timestamp => now - timestamp < 1000);
    if (recentRequests.length >= this.MAX_REQUESTS_PER_SECOND) {
      // Rate limit exceeded, wait before processing
      const waitTime = 1000 - (now - recentRequests[0]); // Time until oldest request is outside the 1-second window
      await new Promise(resolve => setTimeout(resolve, Math.max(waitTime, 100)));
      this.processQueue(); // Retry processing
      return;
    }

    this.executing = true;
    const request = this.queue.shift()!;
    
    // Add timestamp for this request
    this.timestamps.push(now);
    
    try {
      await request();
    } catch (error) {
      console.error('API request failed:', error);
    }
    
    // Wait for the required delay before processing the next request to maintain safe rate
    await new Promise(resolve => setTimeout(resolve, this.REQUEST_DELAY));
    this.processQueue();
  }
}

export const apiLimiter = new ApiLimiter();