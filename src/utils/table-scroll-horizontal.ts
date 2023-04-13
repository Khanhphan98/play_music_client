import { ref } from 'vue';

const startX = ref();
const scrollLeft = ref();
const tableBody = ref<any>();
const isDown = ref<boolean>(false);
const mouseDownActive = 'cursor-grabbing';
export class tableScrollHorizontal {
  constructor(element: HTMLElement) {
    if (!element) {
      return;
    } else {
      tableBody.value = element;
      tableBody.value.addEventListener('mousedown', this.mouseDown);
      tableBody.value.addEventListener('mouseleave', this.mouseLeave);
      tableBody.value.addEventListener('mouseup', this.mouseUp);
      tableBody.value.addEventListener('mousemove', this.mouseMove);
    }
  }
  mouseDown(evt: MouseEvent) {
    isDown.value = true;
    tableBody.value.classList.add(mouseDownActive);
    startX.value = evt.pageX - tableBody.value.offsetLeft;
    scrollLeft.value = tableBody.value.scrollLeft;
  }
  mouseLeave(evt: MouseEvent) {
    isDown.value = false;
    tableBody.value.classList.remove(mouseDownActive);
  }
  mouseUp(evt: MouseEvent) {
    isDown.value = false;
    tableBody.value.classList.remove(mouseDownActive);
  }
  mouseMove(evt: MouseEvent) {
    if (!isDown.value) return;
    evt.preventDefault();
    const x = evt.pageX - tableBody.value.offsetLeft;
    const walk = (x - startX.value) * 3;
    tableBody.value.scrollLeft = scrollLeft.value - walk;
  }
}
