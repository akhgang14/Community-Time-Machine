from backend.memory.retrieval import MemoryRetriever


async def load_initial_memories() -> None:
    """
    Load the synthetic community dataset into shared memory.
    """

    retriever = MemoryRetriever()
    await retriever.load_data()