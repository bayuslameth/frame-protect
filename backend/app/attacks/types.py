from enum import Enum
from pydantic import BaseModel, model_validator

class AttackType(str, Enum):
    JPEG = "jpeg"
    CROP = "crop"
    RESIZE = "resize"
    GAUSSIAN_NOISE = "gaussian_noise"
    BRIGHTNESS = "brightness"
    CONTRAST = "contrast"

class AttackParameters(BaseModel):
    attack_type: AttackType
    parameter: float
    
    @model_validator(mode='after')
    def validate_parameter(self):
        t = self.attack_type
        v = self.parameter
        if t == AttackType.JPEG:
            if v not in [90.0, 70.0, 50.0]:
                raise ValueError("JPEG quality must be 90, 70, or 50")
        elif t == AttackType.CROP:
            if v not in [10.0, 25.0]:
                raise ValueError("Crop percentage must be 10 or 25")
        elif t == AttackType.RESIZE:
            if v not in [75.0, 50.0]:
                raise ValueError("Resize percentage must be 75 or 50")
        elif t == AttackType.GAUSSIAN_NOISE:
            if v not in [5.0, 10.0, 20.0]:
                raise ValueError("Gaussian noise sigma must be 5, 10, or 20")
        elif t == AttackType.BRIGHTNESS:
            if v not in [-30.0, 30.0]:
                raise ValueError("Brightness delta must be -30 or 30")
        elif t == AttackType.CONTRAST:
            if v not in [0.7, 1.0, 1.3]:
                raise ValueError("Contrast factor must be 0.7, 1.0, or 1.3")
        return self
