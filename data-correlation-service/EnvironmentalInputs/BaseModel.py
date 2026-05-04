from abc import ABC, abstractmethod
import typing as t

class BaseModel(ABC):
    @abstractmethod
    def get_environmental_inputs(self) -> t.Optional[t.Dict]:
        pass