export function lazyLoad(image: HTMLImageElement) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src!;
          observer.unobserve(img);
        }
      });
    });
  
    observer.observe(image);
  
    return {
      destroy() {
        observer.unobserve(image);
      }
    };
  }
  