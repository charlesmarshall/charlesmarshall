#class to handle parsing of post/get data in to multi arrays
class ParamSort():
  def __init__(self, structure, request_obj):
    self.structure = structure
    self.request = request_obj
    self.results = []

  def sort(self):
    grouped = {}
    lengths = []
    results=[]
    #convert the post data to key basedarray
    for i, v in enumerate(self.structure):
      grouped[v]=[]
      lengths.insert(i,0)
      for f in self.request.get_all(v):
        grouped[v].append(f)
        lengths[i] += 1
    #convert the grouped to a multi dimensional
    for x in range(max(lengths)):
      tmp = {}
      for f in self.structure:
        if len(grouped[f]) > x :
          tmp[f] = grouped[f][x]
      #if everything mapped properly, save this sucker
      if len(tmp) == len(self.structure):
        results.append(tmp)
    return results


