import sys

def main(known, extra=None, bad=None):
    assert len(known) == 5
    with open('/usr/share/dict/words') as fp:
        while(word := fp.readline().strip()):
            if len(word) == 5:
                for i, c in enumerate(known):
                    if c == '_':
                        continue
                    if c != word[i]:
                        break
                else:
                    if (not extra or all([e in word for e in extra])) and (not bad or not any([e in word for e in bad])):
                        print(word)


if __name__ == '__main__':
    if len(sys.argv) >= 2:
        main(*sys.argv[1:])
    else:
        print(f"Usage: {sys.argv[0]} known [extra] [bad]")
        print("where args are known (like 'kn__n') and optionally extra letters (like 'wo') and bad letters (like 'ioplsdcnt')")
