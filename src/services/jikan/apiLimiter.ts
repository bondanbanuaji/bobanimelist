class ApiLimiter {
  private queue: Array<() => Promise<unknown>> = [];
  private executing = false;
  private timestamps: number[] = [];
  private readonly MAX_REQUESTS_PER_SECOND = 3; // Tenrai allows 4 RPS, use 3 for safety
  private readonly MAX_REQUESTS_PER_MINUTE = 100; // Tenrai allows 120 RPM, use 100 for safety

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

    // Check rate limits
    const now = Date.now();
    this.timestamps = this.timestamps.filter(timestamp => now - timestamp < 60000);
    
    // Check per-minute limit
    if (this.timestamps.length >= this.MAX_REQUESTS_PER_MINUTE) {
      const oldestInWindow = Math.min(...this.timestamps);
      const waitTime = 60000 - (now - oldestInWindow) + 100;
      console.warn(`[API Limiter] Minute limit reached, waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.processQueue();
      return;
    }
    
    // Check per-second limit
    const recentRequests = this.timestamps.filter(timestamp => now - timestamp < 1000);
    if (recentRequests.length >= this.MAX_REQUESTS_PER_SECOND) {
      const waitTime = 1000 - (now - recentRequests[0]) + 50;
      await new Promise(resolve => setTimeout(resolve, Math.max(waitTime, 100)));
      this.processQueue();
      return;
    }

    this.executing = true;
    const request = this.queue.shift()!;
    
    this.timestamps.push(Date.now());
    
    try {
      await request();
    } catch (error) {
      console.error('[API Limiter] Request failed:', error);
    }
    
    // Delay between requests: 400-800ms random (Tenrai is faster than Jikan)
    const randomDelay = Math.floor(Math.random() * 401) + 400;
    await new Promise(resolve => setTimeout(resolve, randomDelay));
    this.processQueue();
  }
}

export const apiLimiter = new ApiLimiter();