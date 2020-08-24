import { Observable } from "rxjs";

interface DeskStatusService {
  getObservable(): Observable<DeskStatus>;
}

class DeskStatus {
  position: DeskPosition;
  at: Date;
}

enum DeskPosition {
  SITTING = "SITTING",
  STANDING = "STANDING",
}

const displayable = (position: DeskPosition): string => {
  let displayableValue;

  switch (position) {
    case DeskPosition.SITTING:
      displayableValue = "Sitting";
      break;
    case DeskPosition.STANDING:
      displayableValue = "Standing";
      break;
  }

  return displayableValue;
};

const invert = (position: DeskPosition): DeskPosition => {
  let invertedValue;

  switch (position) {
    case DeskPosition.SITTING:
      invertedValue = DeskPosition.STANDING;
      break;
    case DeskPosition.STANDING:
      invertedValue = DeskPosition.SITTING;
      break;
  }

  return invertedValue;
};

export default DeskStatusService;
export { DeskStatus, DeskPosition, displayable, invert };
